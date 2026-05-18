import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/card";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

export function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    "guest@example.com";

  const fetchUserData = async () => {
    try {
      const historyResponse = await fetch(
        `http://localhost:5000/api/history?userEmail=${encodeURIComponent(
          userEmail,
        )}`,
      );

      const feedbackResponse = await fetch(
        `http://localhost:5000/api/my-feedback?userEmail=${encodeURIComponent(
          userEmail,
        )}`,
      );

      const historyData = await historyResponse.json();
      const feedbackData = await feedbackResponse.json();

      if (!historyResponse.ok) {
        toast.error(historyData.error || "Failed to load history");
      } else {
        setHistory(historyData);
      }

      if (!feedbackResponse.ok) {
        toast.error(feedbackData.error || "Failed to load feedback");
      } else {
        setFeedback(feedbackData);
      }
    } catch (error) {
      console.error("History fetch error:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl mb-6">My History</h1>

        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            <section className="mb-10">
              <h2 className="text-2xl mb-4">Recently Scanned Products</h2>

              {history.length === 0 ? (
                <Card className="p-6">
                  <p>No scanned products yet.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.map((item) => (
                    <Card key={item._id} className="p-5">
                      <div className="flex gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-24 h-24 object-contain rounded-lg bg-white"
                          />
                        )}

                        <div>
                          <h3 className="text-xl">{item.productName}</h3>
                          <p className="text-sm text-gray-600">
                            Brand: {item.brand || "Not available"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Barcode: {item.barcode || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Score: {item.safetyScore ?? "N/A"} / 100
                          </p>
                          <p className="text-sm text-gray-600">
                            Recommendation: {item.recommendation || "N/A"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl mb-4">My Submitted Feedback</h2>

              {feedback.length === 0 ? (
                <Card className="p-6">
                  <p>No feedback submitted yet.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <Card key={item._id} className="p-5">
                      <h3 className="text-xl">{item.productName}</h3>
                      <p>
                        <strong>Barcode:</strong> {item.barcode}
                      </p>
                      <p>
                        <strong>Brand:</strong> {item.brand || "Not provided"}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {item.category || "Not provided"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="capitalize">{item.status}</span>
                      </p>
                      <p>
                        <strong>Notes:</strong> {item.notes || "No notes"}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
