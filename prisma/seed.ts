import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleProducts = [
  {
    name: "Toxic But Make It Fashion",
    description: "For when you want to be problematic but stylishly. This isn't just a t-shirt, it's a lifestyle choice that your therapist will definitely want to discuss.",
    price: 1299,
    originalPrice: 1599,
    images: JSON.stringify(["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]),
    category: "18+",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["Black", "White", "Blood Red"]),
    rating: 4.8,
    reviews: 247,
    inStock: true,
    status: "active",
    featured: true
  },
  {
    name: "Gym Jaana Hai Bro",
    description: "Motivation not included, sweat stains guaranteed. Perfect for those who think about working out more than actually working out.",
    price: 1499,
    originalPrice: 1799,
    images: JSON.stringify(["/placeholder.svg", "/placeholder.svg"]),
    category: "Fitness",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["Black", "White", "Gray"]),
    rating: 4.5,
    reviews: 189,
    inStock: true,
    status: "active",
    featured: true
  },
  {
    name: "Dog Parent Supremacy",
    description: "Because your dog is better than most humans. Show the world where your priorities lie.",
    price: 1199,
    originalPrice: 1399,
    images: JSON.stringify(["/placeholder.svg"]),
    category: "Pets",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    colors: JSON.stringify(["Black", "White", "Brown"]),
    rating: 4.9,
    reviews: 156,
    inStock: true,
    status: "active",
    featured: true
  },
  {
    name: "Existential Crisis Hoodie",
    description: "Perfect for 3 AM overthinking sessions. Comes with built-in comfort for all your life questions.",
    price: 1799,
    originalPrice: 2199,
    images: JSON.stringify(["/placeholder.svg", "/placeholder.svg"]),
    category: "Funny",
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["Black", "Gray", "Navy"]),
    rating: 4.7,
    reviews: 203,
    inStock: true,
    status: "active",
    featured: true
  },
  {
    name: "Corporate Slave Tee",
    description: "Wear your suffering with pride. Perfect for office casual Fridays and existential dread Mondays.",
    price: 999,
    originalPrice: 1299,
    images: JSON.stringify(["/placeholder.svg"]),
    category: "Profession",
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["Black", "White", "Gray"]),
    rating: 4.6,
    reviews: 134,
    inStock: true,
    status: "active",
    featured: false
  },
  {
    name: "Sarcasm Loading Please Wait",
    description: "For those moments when your filter needs a moment to boot up. Warning: May cause eye rolls.",
    price: 1099,
    originalPrice: null,
    images: JSON.stringify(["/placeholder.svg"]),
    category: "Funny",
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Black", "White"]),
    rating: 4.4,
    reviews: 89,
    inStock: true,
    status: "active",
    featured: false
  }
]

const sampleOrders = [
  {
    orderNumber: "#ORD-001",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@email.com",
    customerPhone: "+91 98765 43210",
    customerAddress: "123 Main Street, Andheri West, Mumbai, Maharashtra 400058",
    subtotal: 2598,
    tax: 259.8,
    shipping: 100,
    total: 2957.8,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "COD",
    shippingAddress: "123 Main Street, Andheri West, Mumbai, Maharashtra 400058",
    items: [
      {
        productId: 1,
        productName: "Toxic But Make It Fashion",
        productPrice: 1299,
        quantity: 2,
        total: 2598,
        productImage: "/placeholder.svg",
        productSize: "L",
        productColor: "Black"
      }
    ]
  },
  {
    orderNumber: "#ORD-002",
    customerName: "Priya Singh",
    customerEmail: "priya.singh@email.com",
    customerPhone: "+91 87654 32109",
    customerAddress: "456 Park Avenue, Connaught Place, Delhi, Delhi 110001",
    subtotal: 1799,
    tax: 179.9,
    shipping: 100,
    total: 2078.9,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",
    shippingAddress: "456 Park Avenue, Connaught Place, Delhi, Delhi 110001",
    items: [
      {
        productId: 4,
        productName: "Existential Crisis Hoodie",
        productPrice: 1799,
        quantity: 1,
        total: 1799,
        productImage: "/placeholder.svg",
        productSize: "M",
        productColor: "Gray"
      }
    ]
  },
  {
    orderNumber: "#ORD-003",
    customerName: "Arjun Patel",
    customerEmail: "arjun.patel@email.com",
    customerPhone: "+91 76543 21098",
    customerAddress: "789 Tech Park, Koramangala, Bangalore, Karnataka 560034",
    subtotal: 2698,
    tax: 269.8,
    shipping: 100,
    total: 3067.8,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",
    shippingAddress: "789 Tech Park, Koramangala, Bangalore, Karnataka 560034",
    trackingNumber: "TRK123456789",
    items: [
      {
        productId: 2,
        productName: "Gym Jaana Hai Bro",
        productPrice: 1499,
        quantity: 1,
        total: 1499,
        productImage: "/placeholder.svg",
        productSize: "XL",
        productColor: "Black"
      },
      {
        productId: 3,
        productName: "Dog Parent Supremacy",
        productPrice: 1199,
        quantity: 1,
        total: 1199,
        productImage: "/placeholder.svg",
        productSize: "L",
        productColor: "White"
      }
    ]
  },
  {
    orderNumber: "#ORD-004",
    customerName: "Sneha Gupta",
    customerEmail: "sneha.gupta@email.com",
    customerPhone: "+91 65432 10987",
    customerAddress: "321 Lake View, Koregaon Park, Pune, Maharashtra 411001",
    subtotal: 999,
    tax: 99.9,
    shipping: 100,
    total: 1198.9,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",
    shippingAddress: "321 Lake View, Koregaon Park, Pune, Maharashtra 411001",
    items: [
      {
        productId: 5,
        productName: "Corporate Slave Tee",
        productPrice: 999,
        quantity: 1,
        total: 999,
        productImage: "/placeholder.svg",
        productSize: "M",
        productColor: "Black"
      }
    ]
  },
  {
    orderNumber: "#ORD-005",
    customerName: "Vikram Kumar",
    customerEmail: "vikram.kumar@email.com",
    customerPhone: "+91 54321 09876",
    customerAddress: "654 Beach Road, Marina Beach, Chennai, Tamil Nadu 600001",
    subtotal: 1099,
    tax: 109.9,
    shipping: 100,
    total: 1308.9,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Online Payment",
    shippingAddress: "654 Beach Road, Marina Beach, Chennai, Tamil Nadu 600001",
    items: [
      {
        productId: 6,
        productName: "Sarcasm Loading Please Wait",
        productPrice: 1099,
        quantity: 1,
        total: 1099,
        productImage: "/placeholder.svg",
        productSize: "L",
        productColor: "White"
      }
    ]
  }
]

async function main() {
  console.log('Start seeding...')
  
  // Create products
  for (const product of sampleProducts) {
    await prisma.product.create({
      data: product
    })
  }
  
  // Create orders with items
  for (const orderData of sampleOrders) {
    const { items, ...orderInfo } = orderData
    
    await prisma.order.create({
      data: {
        ...orderInfo,
        items: {
          create: items
        }
      }
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 