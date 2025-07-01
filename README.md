# STRECK - Streetwear for the Unhinged

Bold, chaotic, unapologetically desi streetwear for Gen Z rebels who don't give a f*ck about being decent.

## 🚀 Features

- **E-commerce Store**: Modern Next.js 14 frontend with beautiful UI
- **Database Integration**: MongoDB with Mongoose ODM for robust data management
- **API Routes**: RESTful API endpoints for products, categories, and orders
- **Enhanced Cart**: Persistent cart with localStorage and advanced management
- **Responsive Design**: Works perfectly on desktop and mobile
- **Shopping Cart**: Real-time cart management with persistence
- **Product Categories**: Organized product collections
- **Search & Filtering**: Advanced product search and category filtering
- **Error Handling**: Comprehensive error handling and validation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: MongoDB with Mongoose
- **State Management**: React Context + Custom Hooks
- **Animations**: GSAP for smooth animations
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd streck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/streck
   
   # Optional: MongoDB Atlas (cloud)
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streck
   ```

4. **Start MongoDB**
   Make sure MongoDB is running locally or use MongoDB Atlas.

5. **Seed the database**
   ```bash
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

This starts the Next.js application on `http://localhost:3000`

### Database Operations
```bash
# Seed the database with sample data
npm run seed

# Reset database (clear and reseed)
npm run db:reset

# Type checking
npm run type-check
```

### Production Build
```bash
npm run build
npm start
```

## 🗄️ Database Setup

### Automatic Seeding
The database will be populated with:
- 5 product categories (18+, Fitness, Pets, Funny, Profession)
- 10 sample products with realistic data and pricing

### Manual Database Setup
If you prefer to set up manually:

1. **Connect to MongoDB**
   ```bash
   mongosh
   use streck
   ```

2. **Create collections**
   ```javascript
   db.createCollection('products')
   db.createCollection('categories')
   db.createCollection('orders')
   ```

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/[id]` - Get single product
- Query parameters:
  - `category` - Filter by category
  - `search` - Search in name and description
  - `page` - Pagination (default: 1)
  - `limit` - Items per page (default: 12)
  - `sort` - Sort field (default: createdAt)
  - `order` - Sort order (asc/desc, default: desc)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[slug]` - Get category by slug

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details

## 🎨 Product Categories

1. **18+ Collection** - Explicit content for the bold
2. **Fitness Collection** - Gym gear for real and wannabe fitness enthusiasts
3. **Pet Lovers Collection** - For people whose pets are their personality
4. **Comedy Collection** - Dark humor that needs therapy
5. **Professional Collection** - Corporate wear for rebels

## 🔧 Development

### Project Structure
```
streck/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── products/      # Product endpoints
│   │   ├── categories/    # Category endpoints
│   │   └── orders/        # Order endpoints
│   ├── category/          # Category pages
│   ├── product/           # Product pages
│   └── checkout/          # Checkout page
├── components/            # React components
├── hooks/                 # Custom React hooks
│   └── use-cart.ts       # Cart management hook
├── lib/                   # Utilities and models
│   ├── models/           # MongoDB models
│   │   ├── Product.ts    # Product schema
│   │   ├── Category.ts   # Category schema
│   │   └── Order.ts      # Order schema
│   ├── db.ts             # Database connection
│   └── utils.ts          # Utility functions
├── scripts/              # Database scripts
│   └── seed.js           # Database seeding
└── public/               # Static assets
```

### Key Features Added

#### Enhanced Cart Management
- Persistent cart with localStorage
- Advanced cart operations (add, remove, update quantity)
- Cart total calculation
- Item count tracking

#### Database Models
- **Product**: Complete product schema with images, sizes, colors, features
- **Category**: Category management with slugs and metadata
- **Order**: Full order tracking with customer details and status

#### API Routes
- RESTful endpoints for all CRUD operations
- Advanced filtering and search capabilities
- Pagination support
- Error handling and validation

#### Utility Functions
- Error handling with custom AppError class
- Input validation (email, phone, pincode)
- Price formatting for Indian Rupees
- Local storage utilities
- Animation helpers

## 🚀 Deployment

### Frontend (Next.js)
Deploy to Vercel, Netlify, or any Next.js-compatible platform:

```bash
# Vercel (recommended)
npm install -g vercel
vercel

# Netlify
npm run build
# Upload the .next folder to Netlify
```

### Database
Use MongoDB Atlas for cloud database hosting:

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update your environment variables

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streck
NODE_ENV=production
```

## 🔒 Security Considerations

- Use strong session secrets in production
- Implement authentication for admin access
- Use HTTPS in production
- Secure MongoDB connections
- Never commit `.env.local` to version control
- Validate all user inputs
- Implement rate limiting for API endpoints

## 🧪 Testing

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
npm run format:check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section below
2. Review the API documentation
3. Open an issue on GitHub

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if MongoDB is running
mongosh

# Verify connection string in .env.local
MONGODB_URI=mongodb://localhost:27017/streck
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**TypeScript Errors**
```bash
# Run type checking
npm run type-check

# Install missing types
npm install @types/node @types/react @types/react-dom
```

---

**STRECK** - Because normal is boring, and decent is overrated. 🖕 