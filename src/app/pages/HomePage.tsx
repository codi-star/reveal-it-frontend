import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Scanner } from "../components/Scanner";
import { ProductAnalysis } from "../components/ProductAnalysis";
import { ProductAnalysisSkeleton } from "../components/ProductAnalysisSkeleton";
import { ProductCard } from "../components/ProductCard";
import { WelcomeSection } from "../components/WelcomeSection";
import { ProductFeedbackForm } from "../components/ProductFeedbackForm";
import { Toaster } from "../components/ui/sonner";

import { getNextProduct } from "../data/productEngine";

export function HomePage() {
  const [productDetected, setProductDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [visibleAlternatives, setVisibleAlternatives] = useState<any[]>([]);
  const [alternativeStartIndex, setAlternativeStartIndex] = useState(0);
  const [missingBarcode, setMissingBarcode] = useState("");
  const [alternativesLoading, setAlternativesLoading] = useState(true);

  const productAnalysisRef = useRef<HTMLDivElement | null>(null);

  const saveScanHistory = async (productData: any) => {
    try {
      const userEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email") ||
        "guest@example.com";

      await fetch("https://reveal-it-backend.onrender.com/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          barcode: productData.barcode,
          productName: productData.name,
          brand: productData.brand,
          category: productData.category,
          image: productData.image,
          safetyScore: productData.analysis?.safetyScore,
          recommendation: productData.analysis?.recommendation,
        }),
      });
    } catch (error) {
      console.error("Save history error:", error);
    }
  };

  const getThreeAlternatives = (items: any[], startIndex: number) => {
    if (items.length <= 3) {
      return items;
    }

    return [
      items[startIndex % items.length],
      items[(startIndex + 1) % items.length],
      items[(startIndex + 2) % items.length],
    ];
  };

  const fetchSaferAlternatives = async (excludeBarcode?: string) => {
    try {
      setAlternativesLoading(true);

      const cachedAlternatives = localStorage.getItem("saferAlternatives");

      if (cachedAlternatives) {
        const cached = JSON.parse(cachedAlternatives);
        setAlternatives(cached);
        setAlternativeStartIndex(0);
        setVisibleAlternatives(getThreeAlternatives(cached, 0));
        setAlternativesLoading(false);
      }

      const url = excludeBarcode
        ? `https://reveal-it-backend.onrender.com/api/safer-alternatives?excludeBarcode=${encodeURIComponent(
            excludeBarcode,
          )}&t=${Date.now()}`
        : `https://reveal-it-backend.onrender.com/api/safer-alternatives?t=${Date.now()}`;

      const response = await fetch(url, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch safer alternatives");
      }

      const validProducts = Array.isArray(data) ? data : [];

      localStorage.setItem("saferAlternatives", JSON.stringify(validProducts));

      setAlternatives(validProducts);
      setAlternativeStartIndex(0);
      setVisibleAlternatives(getThreeAlternatives(validProducts, 0));
    } catch (error) {
      console.error("Fetch safer alternatives error:", error);

      if (!localStorage.getItem("saferAlternatives")) {
        setAlternatives([]);
        setVisibleAlternatives([]);
      }
    } finally {
      setAlternativesLoading(false);
    }
  };

  useEffect(() => {
    fetchSaferAlternatives(product?.barcode);
  }, [product?.barcode]);

  useEffect(() => {
    if (alternatives.length <= 3) {
      return;
    }

    const interval = setInterval(() => {
      setAlternativeStartIndex((previousIndex) => {
        const nextIndex = (previousIndex + 3) % alternatives.length;
        setVisibleAlternatives(getThreeAlternatives(alternatives, nextIndex));
        return nextIndex;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [alternatives]);

  const showProductOnPage = async (productData: any) => {
    setMissingBarcode("");
    setProduct(productData);
    setProductDetected(true);

    if (productData?.analysis) {
      await saveScanHistory(productData);
    }

    setTimeout(() => {
      productAnalysisRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleAlternativeClick = async (selectedProduct: any) => {
    await showProductOnPage(selectedProduct);
  };

  const handleProductDetected = async (input: any) => {
    setIsLoading(true);

    try {
      if (input?.notFound) {
        setProduct(null);
        setProductDetected(false);
        setMissingBarcode(input.barcode);
        return;
      }

      setMissingBarcode("");

      let newProduct;

      if (typeof input === "object" && input !== null) {
        newProduct = input;
      } else if (input === "scan") {
        newProduct = getNextProduct();
      } else {
        const response = await fetch(
          `https://reveal-it-backend.onrender.com/api/search?name=${encodeURIComponent(input)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Product not found");
        }

        newProduct = data;
      }

      await showProductOnPage(newProduct);
    } catch (error) {
      console.error("Search error:", error);
      alert("Product not found in database");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl mb-4 text-center">
              Scan. Analyze. Choose Wisely!
            </h1>
            <p className="text-base sm:text-xl text-gray-600 px-2">
              Discover what's really in your healthcare and cosmetic products
            </p>
          </div>

          <Scanner onProductDetected={handleProductDetected} />
        </section>

        {missingBarcode && (
          <section className="mb-12">
            <ProductFeedbackForm barcode={missingBarcode} />
          </section>
        )}

        {!productDetected && !isLoading && !missingBarcode && (
          <WelcomeSection />
        )}

        {isLoading && (
          <section className="mb-12">
            <ProductAnalysisSkeleton />
          </section>
        )}

        {productDetected && !isLoading && product && (
          <section ref={productAnalysisRef} className="mb-12">
            <ProductAnalysis product={product} />
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-3xl mb-6 text-center">Safer Alternatives</h2>

          <p className="text-gray-600 text-center mb-8">
            {productDetected
              ? "Based on your product, here are safer products from the database:"
              : "Check out these highly-rated safe products from the database:"}
          </p>

          {alternativesLoading ? (
            <p className="text-center text-gray-500">
              Loading safer alternatives from database...
            </p>
          ) : visibleAlternatives.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={visibleAlternatives.map((p) => p.barcode).join("-")}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleAlternatives.map((p, index) => (
                  <ProductCard
                    key={p.barcode}
                    name={p.name}
                    imageUrl={p.image}
                    score={p.analysis?.safetyScore ?? p.score}
                    index={index}
                    onClick={() => handleAlternativeClick(p)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-center text-gray-500">
              No safer alternatives found in database yet.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
