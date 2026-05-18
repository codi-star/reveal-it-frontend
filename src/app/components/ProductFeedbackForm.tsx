import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ProductFeedbackFormProps {
  barcode: string;
}

export function ProductFeedbackForm({ barcode }: ProductFeedbackFormProps) {
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const userEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    "guest@example.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      toast.error("Please enter product name");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://reveal-it-backend.onrender.com/api/product-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barcode,
            productName,
            brand,
            category,
            notes,
            userEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to submit feedback");
        return;
      }

      toast.success("Feedback submitted successfully");
      setSubmitted(true);
    } catch (error) {
      console.error("Feedback submit error:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-6 border-green-200 bg-green-50">
        <h2 className="text-2xl mb-2">Thank you!</h2>
        <p className="text-gray-700">
          Your product feedback has been submitted. Admin will review it and add
          the product soon.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-orange-200 bg-orange-50">
      <h2 className="text-2xl mb-2">Product Not Found</h2>
      <p className="text-gray-700 mb-4">
        Barcode <strong>{barcode}</strong> is not available in our database.
        Help us improve Reveal-It by submitting product details.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Product name *"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <Input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <Input
          placeholder="Category e.g. Skincare, Haircare, Healthcare"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <Input
          placeholder="Notes optional"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {loading ? "Submitting..." : "Submit Product Feedback"}
        </Button>
      </form>
    </Card>
  );
}
