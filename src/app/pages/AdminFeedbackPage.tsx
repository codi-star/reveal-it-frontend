import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

export function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/product-feedback",
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to fetch feedback");
        return;
      }

      setFeedback(data);
    } catch (error) {
      console.error("Admin feedback fetch error:", error);
      toast.error("Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/product-feedback/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update status");
        return;
      }

      toast.success("Status updated");
      fetchFeedback();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl mb-6">Product Feedback</h1>

        {loading && <p>Loading feedback...</p>}

        {!loading && feedback.length === 0 && (
          <Card className="p-6">
            <p>No feedback submitted yet.</p>
          </Card>
        )}

        <div className="space-y-4">
          {feedback.map((item) => (
            <Card key={item._id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl mb-2">{item.productName}</h2>
                  <p>
                    <strong>Barcode:</strong> {item.barcode}
                  </p>
                  <p>
                    <strong>Brand:</strong> {item.brand || "Not provided"}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category || "Not provided"}
                  </p>
                  <p>
                    <strong>User:</strong> {item.userEmail}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.status}
                  </p>
                </div>

                <div>
                  <p className="mb-4">
                    <strong>Notes:</strong> {item.notes || "No notes"}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => updateStatus(item._id, "reviewed")}
                      variant="outline"
                    >
                      Mark Reviewed
                    </Button>

                    <Button
                      onClick={() => updateStatus(item._id, "added")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Added
                    </Button>

                    <Button
                      onClick={() => updateStatus(item._id, "rejected")}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
