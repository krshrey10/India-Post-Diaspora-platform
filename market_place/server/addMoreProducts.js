import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const newProducts = [
  {
    name: "Banarasi Silk Saree",
    description: "Pure silk saree with traditional zari work from Varanasi, Uttar Pradesh",
    price: 8999,
    category: "Traditional Clothing",
    image: "https://prithacrafts.com/wp-content/uploads/2020/12/NTS3737-Pure_Silk_Lined_Banarasi_Saree_Red-111_1000x.jpg",
    seller: "Varanasi Weavers",
    inStock: true,
    rating: 4.8,
    originState: "Uttar Pradesh",
    indiaPostOptimized: true,
    featured: true,
    tags: ["saree", "silk", "banarasi", "clothing"]
  },
  {
    name: "Kanjivaram Silk Saree",
    description: "Traditional Kanjivaram silk from Tamil Nadu with temple border",
    price: 12999,
    category: "Traditional Clothing",
    image: "https://tse3.mm.bing.net/th/id/OIP.C_EC6ZNxzxKdg0I7sV5rngHaJ4?pid=ImgDet&rs=1",
    seller: "Kanchipuram Artisans",
    inStock: true,
    rating: 4.9,
    originState: "Tamil Nadu",
    indiaPostOptimized: true,
    featured: true,
    tags: ["saree", "silk", "kanjivaram", "clothing"]
  },
  {
    name: "Madhubani Painting",
    description: "Traditional Indian folk art painting from Bihar, depicting mythological themes",
    price: 3499,
    category: "Handicrafts",
    image: "https://thumbs.dreamstime.com/z/madhubani-painting-bihar-india-10635920.jpg",
    seller: "Bihar Artisans",
    inStock: true,
    rating: 4.7,
    originState: "Bihar",
    indiaPostOptimized: false,
    featured: true,
    tags: ["painting", "art", "madhubani", "handicraft"]
  },
  {
    name: "Kashmiri Saffron (Kesar)",
    description: "Premium quality saffron from Kashmir valleys - Mongra variety",
    price: 12999,
    category: "Spices & Food Items",
    image: "https://dryherbs.in/wp-content/uploads/2019/04/Kashmiri-Kesar_01.jpg",
    seller: "Kashmir Farmers Co-op",
    inStock: true,
    rating: 4.9,
    originState: "Jammu & Kashmir",
    indiaPostOptimized: true,
    featured: true,
    tags: ["saffron", "spice", "kesar", "food"]
  },
  {
    name: "Temple Jewelry Set",
    description: "Traditional gold-plated temple jewelry inspired by South Indian designs",
    price: 15999,
    category: "Jewelry & Accessories",
    image: "https://i.pinimg.com/originals/a3/7d/5d/a37d5d48ceebd1a1fdf144926e43ca83.jpg",
    seller: "Tamil Nadu Artisans",
    inStock: true,
    rating: 4.6,
    originState: "Tamil Nadu",
    indiaPostOptimized: true,
    featured: false,
    tags: ["jewelry", "temple", "gold", "accessories"]
  },
  {
    name: "Kashmiri Walnut Wood Carving",
    description: "Hand-carved walnut wood furniture from Kashmir - traditional motifs",
    price: 18999,
    category: "Home & Living",
    image: "https://tse1.mm.bing.net/th/id/OIP.VsruoOrgFXa-pKPB6W4TLgHaE8?pid=ImgDet&rs=1",
    seller: "Kashmir Woodcrafts",
    inStock: true,
    rating: 4.5,
    originState: "Jammu & Kashmir",
    indiaPostOptimized: false,
    featured: false,
    tags: ["wood", "carving", "furniture", "home"]
  }
];

async function addNewProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let addedCount = 0;
    let errorCount = 0;
    let existingCount = 0;

    // Check if products already exist to avoid duplicates
    for (const productData of newProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (existingProduct) {
        console.log('⚠️ Product already exists: ' + productData.name);
        existingCount++;
      } else {
        try {
          // Calculate originalPrice if not provided (for products with discount)
          const productWithDefaults = {
            ...productData,
            originalPrice: productData.originalPrice || productData.price
          };
          
          const newProduct = new Product(productWithDefaults);
          await newProduct.save();
          console.log('✅ Added: ' + productData.name);
          addedCount++;
        } catch (saveError) {
          console.log('❌ FAILED to add: ' + productData.name);
          console.log('   Validation error:', saveError.message);
          if (saveError.errors) {
            Object.keys(saveError.errors).forEach(key => {
              console.log('   - ' + key + ': ' + saveError.errors[key].message);
            });
          }
          errorCount++;
        }
      }
    }

    const totalCount = await Product.countDocuments();
    console.log('\n📊 FINAL RESULTS:');
    console.log('✅ Successfully added: ' + addedCount + ' products');
    console.log('⚠️ Already existed: ' + existingCount + ' products');
    console.log('❌ Failed to add: ' + errorCount + ' products');
    console.log('📦 Total products in database: ' + totalCount);
    
    if (errorCount > 0) {
      console.log('\n💡 Some products failed to add. Check the errors above.');
    } else {
      console.log('\n🎉 All products processed successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Error:', error);
    process.exit(1);
  }
}

addNewProducts();