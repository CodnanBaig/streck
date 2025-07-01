const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import models
const Product = require('../lib/models/Product').default;
const Category = require('../lib/models/Category').default;

const categories = [
  {
    name: "18+",
    slug: "18plus",
    description: "Explicit content for the bold and unapologetic",
    image: "/18+ - Final.jpg",
    color: "bg-red-600",
    warning: true,
    isActive: true
  },
  {
    name: "Fitness",
    slug: "fitness",
    description: "Gym gear for real and wannabe fitness enthusiasts",
    image: "/Fitness - Final.jpg",
    color: "bg-gray-700",
    warning: false,
    isActive: true
  },
  {
    name: "Pets",
    slug: "pets",
    description: "For people whose pets are their personality",
    image: "/Pets - Final.jpg",
    color: "bg-gray-600",
    warning: false,
    isActive: true
  },
  {
    name: "Funny",
    slug: "funny",
    description: "Dark humor that needs therapy",
    image: "/Funny - Final.jpg",
    color: "bg-gray-800",
    warning: false,
    isActive: true
  },
  {
    name: "Profession",
    slug: "profession",
    description: "Corporate wear for rebels",
    image: "/Profession - Final.jpg",
    color: "bg-gray-500",
    warning: false,
    isActive: true
  }
];

const products = [
  {
    name: "Toxic But Make It Fashion",
    description: "For when you want to be problematic but stylishly. This isn't just a t-shirt, it's a lifestyle choice that your therapist will definitely want to discuss.",
    price: 1299,
    originalPrice: 1599,
    category: "18+",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Blood Red"],
    features: [
      "100% Cotton (Softer than your ex's apologies)",
      "Pre-shrunk (Unlike your standards)",
      "Machine washable (Unlike your reputation)",
      "Unisex fit (Because toxicity knows no gender)"
    ],
    rating: 4.8,
    reviews: 247,
    inStock: true
  },
  {
    name: "Gym Jaana Hai Bro",
    description: "Motivation not included, sweat stains guaranteed. Perfect for those who want to look like they work out without actually working out.",
    price: 1499,
    originalPrice: 1799,
    category: "Fitness",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
    features: [
      "Moisture-wicking fabric",
      "Breathable design",
      "Comfortable fit",
      "Perfect for gym selfies"
    ],
    rating: 4.6,
    reviews: 189,
    inStock: true
  },
  {
    name: "Dog Parent Supremacy",
    description: "Because your dog is better than most humans. Show the world that your furry friend is your only true companion.",
    price: 1199,
    originalPrice: 1399,
    category: "Pets",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Pink", "Light Blue"],
    features: [
      "Soft cotton blend",
      "Pet-friendly design",
      "Easy to clean",
      "Perfect for dog park visits"
    ],
    rating: 4.9,
    reviews: 312,
    inStock: true
  },
  {
    name: "Existential Crisis Hoodie",
    description: "Perfect for 3 AM overthinking sessions. When life gives you lemons, wear this hoodie and question everything.",
    price: 1799,
    originalPrice: 1999,
    category: "Funny",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Dark Blue"],
    features: [
      "Warm and cozy",
      "Perfect for philosophical discussions",
      "Hood for hiding from reality",
      "Pockets for existential snacks"
    ],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    name: "Corporate Slave Tee",
    description: "Wear your suffering with pride. Because if you're going to sell your soul to corporate, you might as well look good doing it.",
    price: 999,
    originalPrice: 1299,
    category: "Profession",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy"],
    features: [
      "Professional cotton",
      "Office-appropriate design",
      "Subtle rebellion",
      "Perfect for casual Fridays"
    ],
    rating: 4.5,
    reviews: 203,
    inStock: true
  },
  {
    name: "Chaos Coordinator",
    description: "Because someone has to be in charge of the chaos. Might as well be you, looking fabulous while doing it.",
    price: 1399,
    originalPrice: 1599,
    category: "18+",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Red", "Purple"],
    features: [
      "Premium cotton",
      "Chaos-resistant fabric",
      "Leadership-ready design",
      "Perfect for causing organized mayhem"
    ],
    rating: 4.8,
    reviews: 178,
    inStock: true
  },
  {
    name: "Protein Powder Enthusiast",
    description: "For those who think protein powder is a personality trait. Because gains are temporary, but the lifestyle is forever.",
    price: 1299,
    originalPrice: 1499,
    category: "Fitness",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Red"],
    features: [
      "Moisture-wicking",
      "Gym-ready design",
      "Protein powder stain resistant",
      "Perfect for flexing in mirrors"
    ],
    rating: 4.4,
    reviews: 134,
    inStock: true
  },
  {
    name: "Cat Person Energy",
    description: "For those who understand that cats are superior beings and we're just lucky to serve them.",
    price: 1099,
    originalPrice: 1299,
    category: "Pets",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gray", "Black", "White"],
    features: [
      "Soft and comfortable",
      "Cat hair magnet (by design)",
      "Perfect for cat cuddles",
      "Makes you look mysterious like a cat"
    ],
    rating: 4.9,
    reviews: 267,
    inStock: true
  },
  {
    name: "Sarcasm is My Love Language",
    description: "Because sometimes the best way to show love is through expertly crafted sarcasm and witty remarks.",
    price: 1199,
    originalPrice: 1399,
    category: "Funny",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray"],
    features: [
      "Premium cotton",
      "Sarcasm-enhanced fabric",
      "Perfect for witty comebacks",
      "Makes you look clever"
    ],
    rating: 4.6,
    reviews: 198,
    inStock: true
  },
  {
    name: "Meetings Could Have Been Emails",
    description: "The official uniform of everyone who has ever sat through an unnecessary meeting. Because time is money, and meetings are neither.",
    price: 899,
    originalPrice: 1099,
    category: "Profession",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    features: [
      "Professional cotton",
      "Meeting-resistant design",
      "Perfect for passive-aggressive comments",
      "Office-appropriate rebellion"
    ],
    rating: 4.7,
    reviews: 245,
    inStock: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Inserted ${createdCategories.length} categories`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 