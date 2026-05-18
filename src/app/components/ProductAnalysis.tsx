import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { SafetyGauge } from "./SafetyGauge";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Ingredient {
  name: string;
  status?: "safe" | "moderate" | "harmful";
  safetyLevel?: "safe" | "moderate" | "harmful" | "unknown";
  riskScore?: number;
  description?: string;
}

interface AIInsight {
  title: string;
  summary: string;
  positives: string[];
  concerns: string[];
  whoShouldBeCareful: string[];
  usageTips: string[];
  finalVerdict: string;
}

interface ProductData {
  name: string;
  imageUrl?: string;
  image?: string;
  score?: number;
  category?: string;
  brand?: string;
  barcode?: string;
  ingredients?: {
    safe: Ingredient[];
    moderate: Ingredient[];
    harmful: Ingredient[];
  };
  analysis?: {
    safe: Ingredient[];
    moderate: Ingredient[];
    harmful: Ingredient[];
    unknown?: Ingredient[];
    safetyScore: number;
    recommendation: string;
  };
}

interface ProductAnalysisProps {
  product: ProductData;
}

export function ProductAnalysis({ product }: ProductAnalysisProps) {
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const safe = product.analysis?.safe || product.ingredients?.safe || [];
  const moderate =
    product.analysis?.moderate || product.ingredients?.moderate || [];
  const harmful =
    product.analysis?.harmful || product.ingredients?.harmful || [];
  const unknown = product.analysis?.unknown || [];

  const total =
    safe.length + moderate.length + harmful.length + unknown.length || 1;

  const score = product.analysis?.safetyScore ?? product.score ?? 0;

  const getRecommendation = (score: number) => {
    if (product.analysis?.recommendation) {
      if (product.analysis.recommendation === "Safe to Use") {
        return {
          text: product.analysis.recommendation,
          color: "text-green-600",
          bg: "bg-green-50",
        };
      }

      if (product.analysis.recommendation === "Use with Caution") {
        return {
          text: product.analysis.recommendation,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
        };
      }

      return {
        text: product.analysis.recommendation,
        color: "text-red-600",
        bg: "bg-red-50",
      };
    }

    if (score >= 80) {
      return {
        text: "Safe to Use",
        color: "text-green-600",
        bg: "bg-green-50",
      };
    } else if (score >= 60) {
      return {
        text: "Use with Caution",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    } else {
      return {
        text: "Avoid this Product",
        color: "text-red-600",
        bg: "bg-red-50",
      };
    }
  };

  const generateAIInsight = async () => {
    try {
      setAiLoading(true);

      const response = await fetch(
        "https://reveal-it-backend.onrender.com/api/ai-analysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to generate AI insight");
        return;
      }

      setAiInsight(data.insight);
    } catch (error) {
      console.error("AI insight error:", error);
      alert("Failed to generate AI insight");
    } finally {
      setAiLoading(false);
    }
  };

  const recommendation = getRecommendation(score);
  const productImage = product.image || product.imageUrl || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 shadow-lg">
        <h2 className="text-2xl mb-6">Product Analysis</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square mb-4">
              <ImageWithFallback
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl">{product.name}</h3>
          </div>

          <div className="space-y-6">
            <div className={`p-4 rounded-xl ${recommendation.bg}`}>
              <h4 className="text-lg mb-1">Final Recommendation</h4>
              <p className={`text-lg font-semibold ${recommendation.color}`}>
                {recommendation.text}
              </p>
            </div>

            <div>
              <h4 className="text-lg mb-3">Ingredient Analysis</h4>

              {safe.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">
                      Safe Ingredients ({safe.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {safe.map((ingredient, index) => (
                      <Badge
                        key={index}
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        {ingredient.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {moderate.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm">
                      Moderate Risk ({moderate.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moderate.map((ingredient, index) => (
                      <Badge
                        key={index}
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        {ingredient.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {harmful.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm">
                      Harmful Ingredients ({harmful.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {harmful.map((ingredient, index) => (
                      <Badge
                        key={index}
                        className="bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        {ingredient.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {unknown.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">
                      Unknown Ingredients ({unknown.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unknown.map((ingredient, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        {ingredient.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg mb-3">Visual Breakdown</h4>
              <div className="flex h-8 rounded-xl overflow-hidden">
                {safe.length > 0 && (
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-sm"
                    style={{ width: `${(safe.length / total) * 100}%` }}
                  >
                    {Math.round((safe.length / total) * 100)}%
                  </div>
                )}
                {moderate.length > 0 && (
                  <div
                    className="bg-yellow-500 flex items-center justify-center text-white text-sm"
                    style={{ width: `${(moderate.length / total) * 100}%` }}
                  >
                    {Math.round((moderate.length / total) * 100)}%
                  </div>
                )}
                {harmful.length > 0 && (
                  <div
                    className="bg-red-500 flex items-center justify-center text-white text-sm"
                    style={{ width: `${(harmful.length / total) * 100}%` }}
                  >
                    {Math.round((harmful.length / total) * 100)}%
                  </div>
                )}
                {unknown.length > 0 && (
                  <div
                    className="bg-gray-500 flex items-center justify-center text-white text-sm"
                    style={{ width: `${(unknown.length / total) * 100}%` }}
                  >
                    {Math.round((unknown.length / total) * 100)}%
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg mb-3">Safety Score</h4>
              <SafetyGauge score={score} />
            </div>
          </div>

          {product.analysis && (
            <div className="md:col-span-2 border-t pt-6 flex justify-center">
              <Button
                onClick={generateAIInsight}
                disabled={aiLoading}
                className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {aiLoading ? "Generating Insight..." : "Generate AI Insight"}
              </Button>
            </div>
          )}

          {aiInsight && (
            <div className="md:col-span-2 flex justify-center">
              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-4 w-full max-w-4xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-lg">{aiInsight.title}</h4>
                </div>

                <p className="text-gray-700">{aiInsight.summary}</p>

                <div>
                  <h5 className="font-semibold mb-2">Positive Highlights</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {aiInsight.positives.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Main Concerns</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {aiInsight.concerns.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Who Should Be Careful</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {aiInsight.whoShouldBeCareful.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Usage Tips</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {aiInsight.usageTips.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-indigo-200">
                  <p className="font-semibold">
                    AI Verdict: {aiInsight.finalVerdict}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
