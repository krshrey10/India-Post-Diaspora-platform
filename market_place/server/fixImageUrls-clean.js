import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const fixedImageUrls = {
  "Assam Tea Premium Pack (500g)": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop",
  "Kashmiri Saffron Pure (1g)": "https://images.unsplash.com/photo-1596043897660-4c54fdaad0e9?w=300&h=200&fit=crop", 
  "Madhubani Art Painting": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop",
  "Kerala Banana Chips (250g)": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
  "Punjabi Masala Box - 10 Spices": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
  "Rajasthani Handicraft Pottery Set": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
  "Darjeeling First Flush Tea (250g)": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop",
  "Goan Fish Recheado Masala": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop"
};

async function fixImageUrls() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const [productName, imageUrl] of Object.entries(fixedImageUrls)) {
      const result = await Product.findOneAndUpdate(
        { name: productName },
        { image: imageUrl },
        { new: true }
      );
      
      if (result) {
        console.log('✅ Updated: ' + productName);
        console.log('   Old: ' + result.image);
        console.log('   New: ' + imageUrl);
      } else {
        console.log('❌ Not found: ' + productName);
      }
    }

    console.log('\n🎉 All image URLs fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixImageUrls();
