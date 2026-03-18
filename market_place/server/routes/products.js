import express from 'express';
import Product from '../models/Product.js';
import requireAuth from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { seller, sellerId, sellerName } = req.query;
    const query = {};
    if (seller || sellerName) {
      const nameToUse = seller || sellerName;
      // Case-insensitive exact/partial match for seller name
      query.seller = { $regex: new RegExp(nameToUse, 'i') };
    }
    if (sellerId) query.sellerId = sellerId; // future compatibility if sellerId stored
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recommended products for homepage
router.get('/recommendations', async (req, res) => {
  try {
    const { type, limit = 4 } = req.query;
    
    let query = { inStock: true }; // Only show in-stock products
    let sort = { rating: -1, createdAt: -1 };

    switch (type) {
      case 'trending':
        query.$or = [{ popular: true }, { rating: { $gte: 4 } }];
        break;
      case 'regional':
        query.originState = { $exists: true, $ne: '' };
        sort = { originState: 1, rating: -1 };
        break;
      case 'fastShipping':
        query.indiaPostOptimized = true;
        break;
      case 'featured':
      default:
        query.$or = [{ featured: true }, { rating: { $gte: 4 } }];
        break;
    }
    
    const products = await Product.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .select('name description price image seller category rating discount originalPrice originState indiaPostOptimized featured popular tags');

    res.json(products);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product - only for authenticated sellers
router.post('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'seller') return res.status(403).json({ message: 'Only sellers can create products' });

    const payload = {
      ...req.body,
      sellerId: user._id,
      seller: user.businessDetails?.businessName || user.username || user.profile?.firstName
    };
    const product = new Product(payload);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.patch('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;