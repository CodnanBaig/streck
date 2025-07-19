# STRECK - Streetwear for the Unhinged

Bold, chaotic, unapologetically desi streetwear for Gen Z rebels who don't give a f*ck about being decent.

## 🚀 Features

- **E-commerce Store**: Modern Next.js 14 frontend with beautiful UI
- **Responsive Design**: Works perfectly on desktop and mobile
- **Shopping Cart**: Real-time cart management with localStorage persistence
- **Product Categories**: Organized product collections
- **Smooth Animations**: GSAP animations for enhanced user experience
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Animations**: GSAP for smooth animations
- **State Management**: React Context + Local Storage
- **Package Manager**: npm
- **Database**: Prisma ORM with SQLite
- **Image Storage**: Cloudinary
- **Admin Panel**: Full CRUD operations for products, orders, customers

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
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Add your Cloudinary credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Development Tools
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format
npm run format:check
```

## 🎨 Product Categories

1. **18+ Collection** - Explicit content for the bold
2. **Fitness Collection** - Gym gear for real and wannabe fitness enthusiasts
3. **Pet Lovers Collection** - For people whose pets are their personality
4. **Comedy Collection** - Dark humor that needs therapy
5. **Professional Collection** - Corporate wear for rebels

## ☁️ Cloudinary Setup

### Getting Started with Cloudinary

1. **Create a Cloudinary Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account
   - Get your credentials from the dashboard

2. **Environment Variables**
   Add these to your `.env.local` file:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Features**
   - **Automatic Image Optimization**: Images are automatically optimized for web
   - **Multiple Formats**: Supports WebP, AVIF, and other modern formats
   - **Responsive Images**: Automatic resizing for different screen sizes
   - **Drag & Drop Upload**: Easy image upload with preview
   - **File Validation**: Size and type validation (max 5MB, images only)

### Free Tier Limits
- **25 GB storage**
- **25 GB bandwidth/month**
- **25,000 transformations/month**

## 🔧 Development
```
streck/
├── app/                    # Next.js app directory
│   ├── category/          # Category pages
│   ├── product/           # Product pages
│   └── checkout/          # Checkout page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── navbar.tsx        # Navigation component
│   ├── product-card.tsx  # Product display component
│   └── providers.tsx     # Context providers
├── lib/                   # Utilities
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

### Key Features

#### Shopping Cart
- Persistent cart with localStorage
- Add/remove items
- Update quantities
- Cart total calculation
- Item count tracking

#### UI Components
- Responsive navigation
- Product cards with animations
- Category carousel
- Checkout form
- Toast notifications

#### Animations
- GSAP animations for smooth transitions
- Scroll-triggered animations
- Hover effects
- Loading states

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the .next folder to Netlify
```

### Other Platforms
Deploy to any Next.js-compatible platform like:
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Google Cloud Run

## 🔒 Security Considerations

- Use HTTPS in production
- Implement proper CORS policies
- Secure environment variables
- Validate user inputs
- Implement rate limiting

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
2. Review the component documentation
3. Open an issue on GitHub

## 🔧 Troubleshooting

### Common Issues

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

**Styling Issues**
```bash
# Clear Tailwind cache
rm -rf .next
npm run dev
```

---

**STRECK** - Because normal is boring, and decent is overrated. 🖕 