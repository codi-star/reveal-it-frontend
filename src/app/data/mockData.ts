export type Product = {
  id: number;
  name: string;
  image: string;
  ingredients: {
    safe: string[];
    moderate: string[];
    harmful: string[];
  };
  score: number;
};

const img = (id: number) =>
  `https://source.unsplash.com/400x400/?cosmetic,product&sig=${id}`;

export const products = [
  { name: "Dove Beauty Bar", imageUrl: "https://m.media-amazon.com/images/I/71RMOUefM5L.jpg", score: 35, ingredients: { safe: [{ name: "Glycerin", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [{name: "Sulfates", status: "harmful"}] } },
  { name: "Colgate Total Toothpaste", imageUrl: "https://m.media-amazon.com/images/I/71fAc3++hsL.jpg", score: 78, ingredients: { safe: [{ name: "Fluoride", status: "safe" }], moderate: [{ name: "SLS", status: "moderate" }], harmful: [] } },
  { name: "Nivea Soft Cream", imageUrl: "https://www.quickpantry.in/cdn/shop/files/Nivea_Soft_Light_Moisturising_Cream_Quick_Pantry.png?v=1741294236", score: 82, ingredients: { safe: [{ name: "Jojoba Oil", status: "safe" }], moderate: [{ name: "Alcohol", status: "moderate" }], harmful: [] } },
  { name: "Pantene Shampoo", imageUrl: "https://www.quickpantry.in/cdn/shop/files/PanteneLivelyCleanShampooQuickPantry.jpg?v=1747070402&width=1214", score: 70, ingredients: { safe: [{ name: "Panthenol", status: "safe" }], moderate: [{ name: "Silicone", status: "moderate" }], harmful: [{ name: "Sulfate", status: "harmful" }] } },
  { name: "Head & Shoulders Shampoo", imageUrl: "https://m.media-amazon.com/images/I/71RnvqaKDML.jpg", score: 68, ingredients: { safe: [{ name: "Zinc", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [{ name: "Sulfate", status: "harmful" }] } },
  { name: "Cetaphil Cleanser", imageUrl: "https://www.clickoncare.com/cdn/shop/files/CetaphilHydratingFoamingCreamCleanser_236ml-2.jpg?v=1693634024", score: 90, ingredients: { safe: [{ name: "Glycerin", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Himalaya Neem Face Wash", imageUrl: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/him/him50047/y/29.jpg", score: 84, ingredients: { safe: [{ name: "Neem", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Lakme Sunscreen SPF50", imageUrl: "https://m.media-amazon.com/images/I/514DZ+9yQ4L.jpg", score: 72, ingredients: { safe: [{ name: "Zinc Oxide", status: "safe" }], moderate: [{ name: "Alcohol", status: "moderate" }], harmful: [] } },
  { name: "L'Oreal Face Serum", imageUrl: "https://s13emagst.akamaized.net/products/61267/61266341/images/res_e1edf5ce0af1b52b7d371e85d40f0b5d.jpg", score: 75, ingredients: { safe: [{ name: "Hyaluronic Acid", status: "safe" }], moderate: [{ name: "Alcohol", status: "moderate" }], harmful: [] } },
  { name: "Vaseline Jelly", imageUrl: "https://static.beautytocare.com/cdn-cgi/image/width=1600,height=1600,f=auto/media/catalog/product//v/a/vaseline-original-protecting-jelly-100ml_1.jpg", score: 88, ingredients: { safe: [{ name: "Petrolatum", status: "safe" }], moderate: [], harmful: [] } },

  { name: "Biotique Face Wash", imageUrl: "https://www.biotique.com/cdn/shop/products/view01.jpg?v=1675409159", score: 80, ingredients: { safe: [{ name: "Herbal Extract", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Mamaearth Shampoo", imageUrl: "https://www.distacart.com/cdn/shop/files/image_1_7bc1d776-7454-42d2-9f06-91cea9ac793c.png?v=1748079650", score: 83, ingredients: { safe: [{ name: "Onion Oil", status: "safe" }], moderate: [], harmful: [] } },
  { name: "WOW Skin Serum", imageUrl: "https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/12429404/2024/3/13/4bd0faaa-3dd7-4353-9560-09988fdf1e941710325923320-WOW-SKIN-SCIENCE-Vitamin-C-Face-Serum-for-Brightening-Anti-A-1.jpg", score: 77, ingredients: { safe: [{ name: "Vitamin C", status: "safe" }], moderate: [{ name: "Preservative", status: "moderate" }], harmful: [] } },
  { name: "Plum Green Tea Cream", imageUrl: "https://media6.ppl-media.com/tr:h-750,w-750,c-at_max,dpr-2,q-40/static/img/product/233280/plum-green-tea-oil-free-moisturizer-contains-niacinamide-and-hyaluronic-acid-100-percentage-fragrance-free-natural-moisturizers-like-sqalene-oil-free-moisturizer-for-daily-use_12_display_1751525528_22b611c0.jpg", score: 81, ingredients: { safe: [{ name: "Green Tea", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Neutrogena Sunscreen", imageUrl: "https://media6.ppl-media.com/tr:h-750,w-750,c-at_max,dpr-2,q-40/static/img/product/435/neutrogena-ultra-sheer-spf50-30ml_1_display_1671087652_d05465b7.jpg", score: 74, ingredients: { safe: [{ name: "Zinc", status: "safe" }], moderate: [{ name: "Alcohol", status: "moderate" }], harmful: [] } },
  { name: "Garnier Face Wash", imageUrl: "https://www.quickpantry.in/cdn/shop/files/Garnier_Men_Turbo_Bright_Anti-Pollution_Double_Action_Facewash_Quick_Pantry.jpg?v=1751026867&width=1214", score: 76, ingredients: { safe: [{ name: "Vitamin C", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Ponds Moisturizer", imageUrl: "https://www.quickpantry.in/cdn/shop/files/Ponds_Moisturising_Cold_Cream_Quick_Pantry.jpg?v=1740342444", score: 79, ingredients: { safe: [{ name: "Glycerin", status: "safe" }], moderate: [{ name: "Parfum", status: "moderate" }], harmful: [] } },
  { name: "Olay Night Cream", imageUrl: "https://images.ctfassets.net/0v2sa6e8k7dp/2z4OGDyZw3I6gF2VvycvLh/2541e747595298f90d18dbf091e6875f/01_Olay_TotalEffects_20gm_82247774_AntiAgeingNightCream_GROUPANGLE_INDIA_0308.jpg?fm=webp&q=75", score: 86, ingredients: { safe: [{ name: "Retinol", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Clean & Clear Face Wash", imageUrl: "https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/16712910/2025/3/27/cb74b961-8d2f-4bf6-abae-aaee7bb95a731743058398858-CleanClear-Foaming-Face-Wash-for-Oily-Skin-Acne-Prone-Skin-2-1.jpg", score: 73, ingredients: { safe: [{ name: "Water", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Tresemme Conditioner", imageUrl: "https://www.quickpantry.in/cdn/shop/products/tresemme-conditioner-smooth-and-shine-190-ml-quick-pantry.jpg?v=1710539031", score: 71, ingredients: { safe: [{ name: "Keratin", status: "safe" }], moderate: [{ name: "Silicone", status: "moderate" }], harmful: [] } },

  { name: "Dabur Toothpaste", imageUrl: "https://www.quickpantry.in/cdn/shop/products/dabur-red-ayurvedic-paste-quick-pantry-1.jpg?v=1710538338", score: 82, ingredients: { safe: [{ name: "Herbal Extract", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Patanjali Aloe Gel", imageUrl: "https://www.patanjaliayurved.net/assets/product_images/400x500/1766042934aloe1.webp", score: 88, ingredients: { safe: [{ name: "Aloe Vera", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Nivea Body Lotion", imageUrl: "https://www.quickpantry.in/cdn/shop/products/nivea-body-lotion-nourishing-body-milk-for-very-dry-skin-quick-pantry-3.jpg?v=1710538195", score: 84, ingredients: { safe: [{ name: "Almond Oil", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Lux Soap", imageUrl: "https://hbkirana.in/wp-content/uploads/2025/03/luxsoap-1738397960304.jpeg", score: 70, ingredients: { safe: [{ name: "Soap Base", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Dettol Handwash", imageUrl: "https://silverspotindia.com/wp-content/uploads/2023/11/Dettol-Liquid-Handwash-Dispenser-Bottle-Pump-Original-Hand-Wash-200ml-1.jpg", score: 83, ingredients: { safe: [{ name: "Antibacterial Agent", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Savlon Sanitizer", imageUrl: "https://images.apollo247.in/pub/media/catalog/product/S/A/SAV0051_1-AUG23_1.jpg?tr=q-80,f-webp,w-400,dpr-3,c-at_max%20400w", score: 87, ingredients: { safe: [{ name: "Alcohol", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Medimix Soap", imageUrl: "https://www.cholayil.com/wp-content/uploads/2025/02/CLASSIC-125-FOP.jpg", score: 89, ingredients: { safe: [{ name: "Herbal Mix", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Fiama Shower Gel", imageUrl: "https://www.fiama.in/cdn/shop/files/FDEDSG550_1.jpg?v=1743758922", score: 75, ingredients: { safe: [{ name: "Gel Base", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Old Spice Deodorant", imageUrl: "https://assets.myntassets.com/assets/images/11468528/2021/1/19/5a6db619-1af2-4691-bedb-dbdb13d75c871611050204320-Old-Spice-Men-Perfume-and-Body-Mist-9341611050204067-1.jpg", score: 72, ingredients: { safe: [{ name: "Alcohol", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Axe Body Spray", imageUrl: "https://images.apollo247.in/pub/media/catalog/product/A/X/AXE0028_1-JULY23_1.jpg?tr=q-80,f-webp,w-400,dpr-3,c-at_max%20400w", score: 69, ingredients: { safe: [], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [{ name: "Alcohol", status: "harmful" }] } },

  { name: "Beardo Hair Oil", imageUrl: "https://beardo.in/cdn/shop/files/1_d6a6bc74-8c90-4291-aa64-ec37ac034fff.jpg?v=1704354743", score: 86, ingredients: { safe: [{ name: "Argan Oil", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Ustraa Shampoo", imageUrl: "https://d1ebdenobygu5e.cloudfront.net/media/catalog/product/1/_/1_348_1.jpg", score: 78, ingredients: { safe: [{ name: "Herbal Extract", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Minimalist Serum", imageUrl: "https://www.clinikally.com/cdn/shop/files/Minimalist10_VitaminCSerum10ml1.jpg?v=1762159441&width=1000", score: 91, ingredients: { safe: [{ name: "Niacinamide", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Dot & Key Cream", imageUrl: "https://m.media-amazon.com/images/I/61AaQNNiWrL.jpg", score: 80, ingredients: { safe: [{ name: "Vitamin E", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Nykaa Face Wash", imageUrl: "https://images.apollo247.in/pub/media/catalog/product/N/Y/NYK0005_1-AUG23_1.jpg?tr=q-80,f-webp,w-400,dpr-3,c-at_max%20400w", score: 77, ingredients: { safe: [{ name: "Aloe", status: "safe" }], moderate: [{ name: "Fragrance", status: "moderate" }], harmful: [] } },
  { name: "Maybelline Foundation", imageUrl: "https://m.media-amazon.com/images/I/711t9wxyobL.jpg", score: 74, ingredients: { safe: [{ name: "Minerals", status: "safe" }], moderate: [{ name: "Preservative", status: "moderate" }], harmful: [] } },
  { name: "Lakme Kajal", imageUrl: "https://www.lakmeindia.com/cdn/shop/files/29432_S1-8901030979538_ac175923-7bb1-494a-b046-4d0c7bffeafe_1000x.jpg?v=1742201670", score: 79, ingredients: { safe: [{ name: "Carbon Black", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Revlon Lip Balm", imageUrl: "https://assets.myntassets.com/w_360,q_50,,dpr_2,fl_progressive,f_webp/assets/images/336370/2021/8/11/329667f9-d3ba-4bab-9c8c-854117ad9b361628673756795-Revlon-Colorburst-Matte-Lip-Balm-225-Sultry-7811628673756468-1.jpg", score: 83, ingredients: { safe: [{ name: "Beeswax", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Swiss Beauty Primer", imageUrl: "https://swissbeauty.in/cdn/shop/files/SB-1301MAKEUPPRIMER_FOP.jpg?v=1748634258", score: 76, ingredients: { safe: [{ name: "Silicone Base", status: "safe" }], moderate: [], harmful: [] } },
  { name: "Colorbar Cream", imageUrl: "https://m.media-amazon.com/images/I/51Qg2p+UouL._AC_UF1000,1000_QL80_.jpg", score: 78, ingredients: { safe: [{ name: "Vitamin C", status: "safe" }], moderate: [], harmful: [] } }
];