import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: "Assam Tea Premium Pack (500g)",
    description: "Freshly harvested premium Assam tea leaves with rich flavor and aroma",
    price: 899,
    originalPrice: 999,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop",
    seller: "Assam Tea Gardens",
    rating: 4.5,
    discount: 10,
    originState: "Assam",
    indiaPostOptimized: true,
    featured: true,
    popular: true,
    tags: ["tea", "beverage", "assam"],
    inStock: true
  },
  {
    name: "Kashmiri Saffron Pure (1g)",
    description: "Pure Kashmiri saffron strands, hand-picked from the valleys of Kashmir",
    price: 1299,
    category: "Spices",
    image: "https://images.unsplash.com/photo-1596043897660-4c54fdaad0e9?w=300&h=200&fit=crop",
    seller: "Kashmir Valley Farms",
    rating: 4.8,
    originState: "Jammu & Kashmir",
    indiaPostOptimized: true,
    featured: true,
    tags: ["saffron", "spice", "kashmir"],
    inStock: true
  },
  {
    name: "Madhubani Art Painting",
    description: "Traditional Madhubani art painting on handmade paper",
    price: 2500,
    category: "Handicrafts",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop",
    seller: "Bihar Artisans Collective",
    rating: 4.7,
    originState: "Bihar",
    featured: true,
    tags: ["art", "painting", "madhubani"],
    inStock: true
  },
  {
    name: "Kerala Banana Chips (250g)",
    description: "Crispy banana chips made from fresh Kerala bananas",
    price: 499,
    originalPrice: 585,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
    seller: "Kerala Snacks Co.",
    rating: 4.3,
    discount: 15,
    originState: "Kerala",
    indiaPostOptimized: true,
    tags: ["snacks", "chips", "kerala"],
    inStock: true
  },
  {
    name: "Punjabi Masala Box - 10 Spices",
    description: "Authentic Punjabi spice collection with 10 essential spices",
    price: 1599,
    category: "Spices",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
    seller: "Amritsar Spices",
    rating: 4.6,
    originState: "Punjab",
    popular: true,
    tags: ["spices", "masala", "punjab"],
    inStock: true
  },
  {
    name: "Rajasthani Handicraft Pottery Set",
    description: "Beautiful handcrafted pottery set from Rajasthan",
    price: 3200,
    category: "Handicrafts",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
    seller: "Udaipur Crafts",
    rating: 4.9,
    originState: "Rajasthan",
    tags: ["pottery", "handicraft", "rajasthan"],
    inStock: true
  },
  {
    name: "Darjeeling First Flush Tea (250g)",
    description: "Premium first flush Darjeeling tea with delicate flavor",
    price: 1200,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop",
    seller: "Darjeeling Tea Estate",
    rating: 4.4,
    originState: "West Bengal",
    indiaPostOptimized: true,
    featured: true,
    tags: ["tea", "darjeeling", "beverage"],
    inStock: true
  },
  {
    name: "Goan Fish Recheado Masala",
    description: "Traditional Goan fish recheado masala paste",
    price: 699,
    category: "Spices",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
    seller: "Goan Spice Co.",
    rating: 4.2,
    originState: "Goa",
    tags: ["masala", "goan", "spice"],
    inStock: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added to database');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();