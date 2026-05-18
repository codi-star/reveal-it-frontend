require("dotenv").config();
const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    barcode: String,
    name: String,
    category: String,
    brand: String,
    image: String,
    ingredients: [String],
  }),
);

const Ingredient = mongoose.model(
  "Ingredient",
  new mongoose.Schema({
    name: String,
    safetyLevel: String,
    riskScore: Number,
    description: String,
  }),
);

// Ingredients
const ingredients = [
  {
    name: "Neem",
    safetyLevel: "safe",
    riskScore: 1,
    description: "Natural ingredient",
  },
  {
    name: "Turmeric",
    safetyLevel: "safe",
    riskScore: 1,
    description: "Natural ingredient",
  },
  {
    name: "Aloe Vera",
    safetyLevel: "safe",
    riskScore: 1,
    description: "Soothing ingredient",
  },
  {
    name: "Glycerin",
    safetyLevel: "safe",
    riskScore: 1,
    description: "Moisturizer",
  },
  {
    name: "Fragrance",
    safetyLevel: "moderate",
    riskScore: 6,
    description: "May cause irritation",
  },
  {
    name: "Phenoxyethanol",
    safetyLevel: "moderate",
    riskScore: 5,
    description: "Preservative",
  },
  {
    name: "Alcohol Denat",
    safetyLevel: "moderate",
    riskScore: 6,
    description: "Drying agent",
  },
  {
    name: "Methylisothiazolinone",
    safetyLevel: "harmful",
    riskScore: 8,
    description: "Allergen",
  },
  {
    name: "Methylchloroisothiazolinone",
    safetyLevel: "harmful",
    riskScore: 8,
    description: "Skin irritant",
  },
];

// Generate 100 full products
const products = Array.from({ length: 100 }, (_, i) => ({
  barcode: (8900000000000 + i).toString(),
  name: `Product ${i + 1}`,
  category: "cosmetic",
  brand: ["Himalaya", "Dove", "Nivea", "Mamaearth"][i % 4],
  image: "https://via.placeholder.com/300",
  ingredients: [
    "Neem",
    "Turmeric",
    "Glycerin",
    "Fragrance",
    i % 3 === 0 ? "Methylisothiazolinone" : "Phenoxyethanol",
  ],
}));

// overwrite first real product
products[0] = {
  barcode: "8901138512187",
  name: "Himalaya Purifying Neem Face Wash",
  category: "cosmetic",
  brand: "Himalaya",
  image: "https://via.placeholder.com/300",
  ingredients: [
    "Neem",
    "Turmeric",
    "Phenoxyethanol",
    "Fragrance",
    "Methylisothiazolinone",
    "Methylchloroisothiazolinone",
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Product.deleteMany({});
  console.log("Old products deleted");

  for (let ing of ingredients) {
    await Ingredient.updateOne(
      { name: ing.name },
      { $set: ing },
      { upsert: true },
    );
  }

  await Product.insertMany(products);

  console.log("✅ EXACT 100 CLEAN PRODUCTS ADDED");

  mongoose.disconnect();
}

seed();
