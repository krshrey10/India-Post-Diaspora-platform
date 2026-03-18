import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Banarasi Silk Saree",
    description: "Pure silk saree with traditional zari work from Varanasi",
    price: 8999,
    category: "Traditional Clothing",
    image: "https://prithacrafts.com/wp-content/uploads/2020/12/NTS",
    seller: "Varanasi Weavers",
    inStock: true,
    region: "Uttar Pradesh"
  },
  {
    name: "Kanjivaram Silk Saree",
    description: "Traditional Kanjivaram silk from Tamil Nadu with intricate designs",
    price: 12999,
    category: "Traditional Clothing",
    image: "https://tse3.mm.bing.net/th/id/OIP.C_EC62NxzxKdgQI7sv5r",
    seller: "Kanchipuram Artisans",
    inStock: true,
    region: "Tamil Nadu"
  },
  {
    name: "Bandhani Dupatta",
    description: "Traditional tie-dye Bandhani work from Gujarat and Rajasthan",
    price: 3499,
    category: "Traditional Clothing",
    image: "https://tse4.mm.bing.net/th/id/OIP.b0s1jyy19LaM48BcWcaV",
    seller: "Kutch Craftsmen",
    inStock: true,
    region: "Gujarat"
  },
  {
    name: "Madhubani Painting",
    description: "Traditional Indian folk art painting from Bihar",
    price: 3499,
    category: "Handicrafts",
    image: "https://thumbs.dreamstime.com/z/madhubani-painting-bihar-india-10635920.jpg",
    seller: "Bihar Artisans",
    inStock: true,
    region: "Bihar"
  },
  {
    name: "Blue Pottery Vase",
    description: "Handcrafted blue pottery from Jaipur with Persian influences",
    price: 2199,
    category: "Handicrafts",
    image: "https://i.pinimg.com/originals/b4/c2/29/b4c229aa69a66cb",
    seller: "Jaipur Craftsmen",
    inStock: true,
    region: "Rajasthan"
  },
  {
    name: "Kashmiri Pashmina Shawl",
    description: "Authentic Pashmina wool shawl from Kashmir with intricate embroidery",
    price: 8999,
    category: "Handicrafts",
    image: "https://i.pinimg.com/originals/d4/e3/58/d4e3582f1bca8ae",
    seller: "Kashmir Valley Crafts",
    inStock: true,
    region: "Kashmir"
  },
  {
    name: "Bidriware Hookah",
    description: "Traditional Bidri metal craft from Karnataka with silver inlay",
    price: 5699,
    category: "Handicrafts",
    image: "https://a.istdibscdn.com/18th-century-indian-bidriware",
    seller: "Bidar Artisans",
    inStock: true,
    region: "Karnataka"
  },
  {
    name: "Dhokra Art Elephant",
    description: "Tribal brass metal craft from Chhattisgarh and West Bengal",
    price: 2899,
    category: "Handicrafts",
    image: "https://www.artisansoul.in/cdn/shop/products/Untitledde",
    seller: "Tribal Artisans",
    inStock: true,
    region: "Chhattisgarh"
  },
  {
    name: "Kashmiri Saffron (Kesar)",
    description: "Premium quality saffron from Kashmir valleys - Mongra variety",
    price: 12999,
    category: "Spices & Food Items",
    image: "https://dryherbs.in/wp-content/uploads/2019/04/Kashmiri",
    seller: "Kashmir Farmers Co-op",
    inStock: true,
    region: "Kashmir"
  },
  {
    name: "Assam Tea Leaves",
    description: "Organic garden fresh tea leaves from Assam - Orthodox variety",
    price: 899,
    category: "Spices & Food Items",
    image: "https://5.imimg.com/data5/SELLER/Default/2022/5/OA/SI/J",
    seller: "Assam Tea Gardens",
    inStock: true,
    region: "Assam"
  },
  {
    name: "Alleppey Green Cardamom",
    description: "Premium green cardamom from Kerala - known as Queen of Spices",
    price: 1899,
    category: "Spices & Food Items",
    image: "https://5.imimg.com/data5/SELLER/Default/2021/8/MO/UI/K",
    seller: "Kerala Spice Farmers",
    inStock: true,
    region: "Kerala"
  },
  {
    name: "Temple Jewelry Set",
    description: "Traditional gold-plated temple jewelry inspired by South Indian designs",
    price: 15999,
    category: "Jewelry & Accessories",
    image: "https://i.pinimg.com/originals/a3/7d/5d/a37d54f8ccebd1a",
    seller: "Tamil Nadu Artisans",
    inStock: true,
    region: "Tamil Nadu"
  },
  {
    name: "Lac Bangles Set",
    description: "Handcrafted lac bangles with traditional designs from Rajasthan",
    price: 1499,
    category: "Jewelry & Accessories",
    image: "https://tset.mm.bing.net/th/id/OIP.Mdg0fetpZigewpXpdLM2",
    seller: "Rajasthan Artisans",
    inStock: true,
    region: "Rajasthan"
  },
  {
    name: "Mysore Silk Cushions",
    description: "Pure silk cushion covers with traditional Mysore paintings",
    price: 3299,
    category: "Home & Living",
    image: "https://tsel.mm.bing.net/th/id/OIP.EI07xIZyKKa6SQmVaeSe",
    seller: "Mysore Silk Weavers",
    inStock: true,
    region: "Karnataka"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Database seeded successfully with products');
    console.log(`Added ${sampleProducts.length} products to the database`);

    // Display products by category
    const categories = [...new Set(sampleProducts.map(p => p.category))];
    categories.forEach(category => {
      const count = sampleProducts.filter(p => p.category === category).length;
      console.log(`- ${category}: ${count} products`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();