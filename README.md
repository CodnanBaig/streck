# STRECK - Streetwear for the Unhinged

Bold, chaotic, unapologetically desi streetwear for Gen Z rebels who don't give a f*ck about being decent.

## 🚀 Features

- **E-commerce Store**: Modern Next.js frontend with beautiful UI
- **Admin Panel**: Full-featured AdminJS dashboard for managing products, categories, and orders
- **MongoDB Integration**: Robust database with Mongoose ODM
- **Responsive Design**: Works perfectly on desktop and mobile
- **Shopping Cart**: Real-time cart management
- **Product Categories**: Organized product collections

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: MongoDB with Mongoose
- **Admin Panel**: AdminJS with Express
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd streck
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/streck
   
   # AdminJS Configuration
   SESSION_SECRET=your-super-secret-session-key-here
   ADMIN_PORT=3001
   
   # Next.js Admin URL (optional)
   NEXT_PUBLIC_ADMIN_URL=http://localhost:3001/admin
   ```

4. **Start MongoDB**
   Make sure MongoDB is running locally or use MongoDB Atlas.

## 🚀 Running the Application

### Development Mode (Both servers)
```bash
npm run dev:admin
```

This starts:
- Next.js frontend on `http://localhost:3000`
- AdminJS panel on `http://localhost:3001/admin`

### Separate Development
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Admin Panel
npm run admin
```

### Production Build
```bash
npm run build
npm start
```

## 🗄️ Database Setup

### Seed the database with sample data
```bash
npm run seed
```

This will populate your database with:
- 5 product categories (18+, Fitness, Pets, Funny, Profession)
- 10 sample products with realistic data

## 📊 Admin Panel Features

Access the admin panel at `http://localhost:3001/admin`

### Available Resources:
- **Products**: Manage product listings, prices, images, categories
- **Categories**: Organize product collections with custom branding
- **Orders**: Track customer orders, shipping, and payment status

### Admin Features:
- ✅ Full CRUD operations
- ✅ Advanced filtering and search
- ✅ File upload support
- ✅ Responsive dashboard
- ✅ Custom branding
- ✅ Real-time statistics

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
│   ├── admin/             # Admin redirect page
│   ├── category/          # Category pages
│   ├── product/           # Product pages
│   └── checkout/          # Checkout page
├── components/            # React components
├── lib/                   # Utilities and models
│   └── models/           # MongoDB models
├── scripts/              # Database scripts
├── admin-server.js       # AdminJS server
└── public/               # Static assets
```

### Key Files
- `admin-server.js` - Standalone AdminJS server
- `lib/models/` - MongoDB schemas (Product, Category, Order)
- `scripts/seed.js` - Database seeding script
- `components/navbar.tsx` - Navigation with admin link

## 🚀 Deployment

### Frontend (Next.js)
Deploy to Vercel, Netlify, or any Next.js-compatible platform.

### Admin Panel (AdminJS)
Deploy the admin server to platforms like:
- Railway
- Heroku
- DigitalOcean
- AWS EC2

### Database
Use MongoDB Atlas for cloud database hosting.

## 🔒 Security Considerations

- Use strong session secrets in production
- Implement authentication for admin access
- Use HTTPS in production
- Secure MongoDB connections
- Never commit `.env.local` to version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the `ADMIN_SETUP.md` file for detailed setup instructions
2. Review the troubleshooting section
3. Open an issue on GitHub

---

**STRECK** - Because normal is boring, and decent is overrated. 🖕 