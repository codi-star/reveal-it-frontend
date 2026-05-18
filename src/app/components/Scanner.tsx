import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Camera, CameraOff, Search, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Tesseract from "tesseract.js";

interface ScannerProps {
  onProductDetected: (product: any) => void;
}

export function Scanner({ onProductDetected }: ScannerProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);

  const supportedBarcodeFormats = [
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.CODE_39,
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/suggestions?query=${encodeURIComponent(
            searchQuery.trim(),
          )}`,
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (error) {
        console.error("Suggestion fetch error:", error);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchProductByBarcode = async (barcode: string) => {
    try {
      setLoading(true);

      const cleanBarcode = barcode.replace(/\D/g, "");

      if (!cleanBarcode) {
        toast.error("No barcode number detected");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/barcode?code=${encodeURIComponent(
          cleanBarcode,
        )}`,
      );

      const product = await response.json();

      if (!response.ok) {
        toast.error(product.error || `Product not found: ${cleanBarcode}`);
        onProductDetected({
          notFound: true,
          barcode: cleanBarcode,
        });
        return;
      }

      await stopCamera();
      onProductDetected(product);
      toast.success(`${product.name || "Product"} detected!`);
    } catch (error) {
      console.error("Barcode fetch error:", error);
      toast.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductByName = async (name: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/search?name=${encodeURIComponent(name)}`,
      );

      const product = await response.json();

      if (!response.ok) {
        toast.error(product.error || "Product not found");
        return;
      }

      setSearchQuery(product.name || name);
      setSuggestions([]);
      setShowSuggestions(false);

      onProductDetected(product);
      toast.success(`${product.name || "Product"} found!`);
    } catch (error) {
      console.error("Search fetch error:", error);
      toast.error("Failed to search product");
    } finally {
      setLoading(false);
    }
  };

  const extractBarcodeFromOCR = async (file: File) => {
    const result = await Tesseract.recognize(file, "eng");
    const text = result.data.text || "";
    const digitsOnly = text.replace(/\D/g, "");

    return (
      digitsOnly.match(/\d{13}/)?.[0] ||
      digitsOnly.match(/\d{12}/)?.[0] ||
      digitsOnly.match(/\d{8}/)?.[0] ||
      null
    );
  };

  const scanImageWithZXing = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);

    try {
      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(imageUrl);
      return result.getText();
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const startCamera = async () => {
    try {
      scannedRef.current = false;
      setCameraActive(true);

      setTimeout(async () => {
        const scanner = new Html5Qrcode("reader", {
          formatsToSupport: supportedBarcodeFormats,
          verbose: false,
        });

        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 520, height: 260 },
            aspectRatio: 1.777,
          },
          async (decodedText: string) => {
            if (scannedRef.current) return;

            scannedRef.current = true;
            toast.success(`Barcode detected: ${decodedText}`);
            await fetchProductByBarcode(decodedText);
          },
          () => {},
        );

        toast.success("Camera started");
      }, 300);
    } catch (error) {
      console.error("Camera start error:", error);
      toast.error("Unable to start camera");
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (error) {
      console.error("Scanner stop error:", error);
    }

    const reader = document.getElementById("reader");
    if (reader) reader.innerHTML = "";

    setCameraActive(false);
  };

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!barcodeInput.trim()) {
      toast.error("Please enter a barcode number");
      return;
    }

    await fetchProductByBarcode(barcodeInput.trim());
  };

  const handleImageScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      let decodedText = "";

      try {
        const imageScanner = new Html5Qrcode("image-reader", {
          formatsToSupport: supportedBarcodeFormats,
          verbose: false,
        });

        decodedText = await imageScanner.scanFile(file, true);
        await imageScanner.clear();
      } catch {
        try {
          decodedText = await scanImageWithZXing(file);
        } catch {
          const ocrBarcode = await extractBarcodeFromOCR(file);

          if (!ocrBarcode) {
            toast.error(
              "Could not detect barcode. Try a closer photo or enter barcode manually.",
            );
            return;
          }

          decodedText = ocrBarcode;
        }
      }

      toast.success(`Barcode detected: ${decodedText}`);
      await fetchProductByBarcode(decodedText);
    } catch (error) {
      console.error("Image scan error:", error);
      toast.error("Image scan failed. Try entering barcode manually.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    await fetchProductByName(searchQuery.trim());
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {!cameraActive ? (
            <Button
              onClick={startCamera}
              className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Start Camera
            </Button>
          ) : (
            <Button
              onClick={stopCamera}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <CameraOff className="w-4 h-4" />
              Close Camera
            </Button>
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white cursor-pointer">
            <Upload className="w-4 h-4" />
            Scan Image File
            <input
              type="file"
              accept="image/*"
              onChange={handleImageScan}
              className="hidden"
            />
          </label>
        </div>

        {cameraActive && (
          <div className="relative rounded-xl overflow-hidden bg-gray-900">
            <div id="reader" className="w-full" />
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}
          </div>
        )}

        <div id="image-reader" className="hidden"></div>

        <div className="border-t pt-4">
          <form onSubmit={handleBarcodeSubmit} className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Enter barcode number for testing..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="flex-1"
            />

            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Test Barcode
            </Button>
          </form>

          <form onSubmit={handleSearch} className="relative flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search product before buying..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fetchProductByName(item.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain bg-gray-50 rounded"
                        />
                      )}

                      <span className="text-sm text-gray-800">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </form>

          <p className="text-sm text-gray-600 mt-2">
            Scan a product barcode, upload a barcode image, enter barcode
            number, or search manually.
          </p>
        </div>
      </div>
    </Card>
  );
}
