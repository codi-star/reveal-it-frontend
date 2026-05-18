require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const productSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  brand: String,
  image: String,
  ingredients: [String],
});

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  safetyLevel: {
    type: String,
    enum: ["safe", "moderate", "harmful"],
    required: true,
  },
  riskScore: { type: Number, required: true },
  description: String,
});

const productFeedbackSchema = new mongoose.Schema(
  {
    barcode: { type: String, required: true },
    productName: { type: String, required: true },
    brand: String,
    category: String,
    notes: String,
    userEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "added", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const scanHistorySchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    barcode: String,
    productName: { type: String, required: true },
    brand: String,
    category: String,
    image: String,
    safetyScore: Number,
    recommendation: String,
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
const Ingredient = mongoose.model("Ingredient", ingredientSchema);
const ProductFeedback = mongoose.model(
  "ProductFeedback",
  productFeedbackSchema,
);
const ScanHistory = mongoose.model("ScanHistory", scanHistorySchema);

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function analyzeIngredients(productIngredients) {
  const safe = [];
  const moderate = [];
  const harmful = [];
  const unknown = [];
  let totalRisk = 0;

  for (const ingredientName of productIngredients || []) {
    const cleanName = ingredientName.trim();

    const ingredient = await Ingredient.findOne({
      name: {
        $regex: new RegExp("^" + escapeRegex(cleanName) + "$", "i"),
      },
    });

    if (!ingredient) {
      unknown.push({
        name: cleanName,
        safetyLevel: "unknown",
        riskScore: 5,
        description: "No safety data available yet",
      });

      totalRisk += 5;
      continue;
    }

    const item = {
      name: ingredient.name,
      safetyLevel: ingredient.safetyLevel,
      riskScore: ingredient.riskScore,
      description: ingredient.description,
    };

    totalRisk += ingredient.riskScore;

    if (ingredient.safetyLevel === "safe") safe.push(item);
    if (ingredient.safetyLevel === "moderate") moderate.push(item);
    if (ingredient.safetyLevel === "harmful") harmful.push(item);
  }

  const ingredientCount = productIngredients?.length || 1;
  const averageRisk = totalRisk / ingredientCount;
  const safetyScore = Math.max(0, Math.round(100 - averageRisk * 10));

  let recommendation = "Safe to Use";

  if (safetyScore < 75 && safetyScore >= 50) {
    recommendation = "Use with Caution";
  }

  if (safetyScore < 50) {
    recommendation = "Avoid";
  }

  return {
    safe,
    moderate,
    harmful,
    unknown,
    safetyScore,
    recommendation,
  };
}

function formatProductResponse(product, analysis) {
  return {
    barcode: product.barcode,
    name: product.name,
    image: product.image,
    category: product.category,
    brand: product.brand,
    ingredients: product.ingredients,
    analysis,
    score: analysis.safetyScore,
  };
}

app.get("/api/barcode", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Barcode required" });
  }

  try {
    const cleanCode = String(code).trim();

    const product = await Product.findOne({
      barcode: {
        $regex: new RegExp("^" + escapeRegex(cleanCode) + "$"),
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found in Reveal-It database",
        barcode: cleanCode,
      });
    }

    const analysis = await analyzeIngredients(product.ingredients);

    res.json(formatProductResponse(product, analysis));
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/search", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Product name required" });
  }

  try {
    const cleanName = name.trim();

    const product = await Product.findOne({
      name: {
        $regex: new RegExp(escapeRegex(cleanName), "i"),
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found in Reveal-It database",
      });
    }

    const analysis = await analyzeIngredients(product.ingredients);

    res.json(formatProductResponse(product, analysis));
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// =========================
// LEVENSHTEIN DISTANCE
// =========================
function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// =========================
// PRODUCT SEARCH
// =========================
app.get("/api/search", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      error: "Product name required",
    });
  }

  try {
    const cleanName = name.trim();

    // 1. DIRECT SEARCH
    let product = await Product.findOne({
      name: {
        $regex: new RegExp(escapeRegex(cleanName), "i"),
      },
    });

    // 2. FUZZY SEARCH IF NOT FOUND
    if (!product) {
      const allProducts = await Product.find({}, "name");

      let bestMatch = null;
      let lowestDistance = Infinity;

      for (const p of allProducts) {
        const distance = levenshtein(
          cleanName.toLowerCase(),
          p.name.toLowerCase(),
        );

        if (distance < lowestDistance) {
          lowestDistance = distance;
          bestMatch = p;
        }
      }

      // allow small spelling mistakes
      if (bestMatch && lowestDistance <= 5) {
        product = await Product.findById(bestMatch._id);
      }
    }

    if (!product) {
      return res.status(404).json({
        error: "Product not found in Reveal-It database",
      });
    }

    const analysis = await analyzeIngredients(product.ingredients);

    res.json(formatProductResponse(product, analysis));
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// =========================
// LIVE SEARCH SUGGESTIONS
// =========================
app.get("/api/suggestions", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 1) {
      return res.json([]);
    }

    const cleanQuery = query.trim();

    const products = await Product.find({
      name: {
        $regex: new RegExp(escapeRegex(cleanQuery), "i"),
      },
    })
      .select("name image")
      .limit(8);

    const suggestions = products.map((p) => ({
      name: p.name,
      image: p.image,
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestions error:", error);

    res.status(500).json([]);
  }
});

app.get("/api/safer-alternatives", async (req, res) => {
  try {
    const { excludeBarcode } = req.query;

    const products = await Product.find({
      barcode: { $exists: true, $ne: "" },
      name: { $exists: true, $ne: "" },
      image: { $exists: true, $ne: "" },
      "ingredients.0": { $exists: true },
    }).limit(60);

    const analyzedProducts = [];

    for (const product of products) {
      if (
        excludeBarcode &&
        String(product.barcode).trim() === String(excludeBarcode).trim()
      ) {
        continue;
      }

      const analysis = await analyzeIngredients(product.ingredients || []);

      analyzedProducts.push(formatProductResponse(product, analysis));
    }

    analyzedProducts.sort(
      (a, b) => b.analysis.safetyScore - a.analysis.safetyScore,
    );

    res.json(analyzedProducts.slice(0, 30));
  } catch (error) {
    console.error("Safer alternatives error:", error);
    res.status(500).json({ error: "Failed to fetch safer alternatives" });
  }
});

app.post("/api/ai-analysis", async (req, res) => {
  try {
    const { product } = req.body;

    if (!product || !product.name || !product.analysis) {
      return res.status(400).json({
        error: "Product with analysis data is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key missing in backend .env file",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 450,
      },
    });

    const prompt = `
You are an ingredient safety assistant.

Give a SHORT, useful product-specific ingredient insight.
Use ONLY the provided product data.
Do not invent ingredients.
Do not give medical diagnosis.
Do not use markdown, bold symbols, or extra formatting.
Keep it simple for normal users.
Keep every point short and direct.

Return ONLY valid JSON:
{
  "title": "AI Ingredient Insight",
  "summary": "2 short sentences only",
  "positives": ["maximum 3 short points"],
  "concerns": ["maximum 3 short points"],
  "whoShouldBeCareful": ["maximum 2 short points"],
  "usageTips": ["maximum 2 short points"],
  "finalVerdict": "one short sentence"
}

Product data:
${JSON.stringify(product, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let insight;

    try {
      insight = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Gemini JSON parse error:", cleanedText);

      return res.status(500).json({
        error: "AI response format error. Please try again.",
      });
    }

    res.json({
      message: "Gemini AI ingredient insight generated successfully",
      insight,
    });
  } catch (error) {
    console.error("Gemini AI analysis error:", error);

    res.status(500).json({
      error: "Failed to generate Gemini AI ingredient insight",
    });
  }
});

app.post("/api/history", async (req, res) => {
  const {
    userEmail,
    barcode,
    productName,
    brand,
    category,
    image,
    safetyScore,
    recommendation,
  } = req.body;

  if (!userEmail || !productName) {
    return res.status(400).json({
      error: "User email and product name are required",
    });
  }

  try {
    const history = await ScanHistory.create({
      userEmail: userEmail.trim().toLowerCase(),
      barcode: barcode || "",
      productName,
      brand: brand || "",
      category: category || "",
      image: image || "",
      safetyScore,
      recommendation,
    });

    res.status(201).json({
      message: "History saved successfully",
      history,
    });
  } catch (error) {
    console.error("Save history error:", error);
    res.status(500).json({ error: "Failed to save history" });
  }
});

app.get("/api/history", async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email required" });
  }

  try {
    const history = await ScanHistory.find({
      userEmail: userEmail.trim().toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.post("/api/product-feedback", async (req, res) => {
  const { barcode, productName, brand, category, notes, userEmail } = req.body;

  if (!barcode || !productName || !userEmail) {
    return res.status(400).json({
      error: "Barcode, product name, and user email are required",
    });
  }

  try {
    const feedback = await ProductFeedback.create({
      barcode: barcode.trim(),
      productName: productName.trim(),
      brand: brand || "",
      category: category || "",
      notes: notes || "",
      userEmail: userEmail.trim().toLowerCase(),
      status: "pending",
    });

    res.status(201).json({
      message: "Product feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Product feedback error:", error);
    res.status(500).json({ error: "Failed to submit product feedback" });
  }
});

app.get("/api/my-feedback", async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email required" });
  }

  try {
    const feedback = await ProductFeedback.find({
      userEmail: userEmail.trim().toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    console.error("My feedback error:", error);
    res.status(500).json({ error: "Failed to fetch user feedback" });
  }
});

app.get("/api/admin/product-feedback", async (req, res) => {
  try {
    const feedback = await ProductFeedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Admin feedback error:", error);
    res.status(500).json({ error: "Failed to fetch admin feedback" });
  }
});

app.patch("/api/admin/product-feedback/:id", async (req, res) => {
  const { status } = req.body;

  if (!["pending", "reviewed", "added", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const feedback = await ProductFeedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({
      message: "Feedback status updated",
      feedback,
    });
  } catch (error) {
    console.error("Update feedback error:", error);
    res.status(500).json({ error: "Failed to update feedback status" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.post("/api/ingredients", async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);

    res.status(201).json({
      message: "Ingredient added successfully",
      ingredient,
    });
  } catch (error) {
    console.error("Add ingredient error:", error);
    res.status(500).json({ error: "Failed to add ingredient" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
