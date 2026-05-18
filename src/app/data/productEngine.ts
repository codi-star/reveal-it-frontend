import { products } from "./mockData";

// 🔁 INTERNAL POINTER (for alternating products)
let currentIndex = 0;

// ✅ ALWAYS RETURN NEXT PRODUCT (NO REPEAT)
export const getNextProduct = () => {
  const product = products[currentIndex];
  currentIndex = (currentIndex + 1) % products.length;
  return product;
};

// 🔍 SEARCH (MATCH OR FALLBACK TO NEXT)
export const searchProduct = (query: string) => {
  const found = products.find((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return found || getNextProduct();
};

// 💡 BETTER ALTERNATIVES
export const getBetterAlternatives = (current: any) => {
  return products
    .filter((p) => p.score > current.score)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};