import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import requireAuth from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey'; // Use environment variable

// Register new user - UPDATED VERSION
router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      username, 
      email, 
      password, 
      phone, 
      gender, 
      dateOfBirth, 
      role = 'buyer' 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({ 
      firstName,
      lastName,
      username,
      email, 
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      role,
      profile: {
        firstName,
        lastName,
        phone,
        gender,
        dateOfBirth
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isSellerVerified: newUser.role === 'seller' ? false : true
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Registration failed. Please try again.',
      error: err.message 
    });
  }
});

// Seller Registration - NEW ENDPOINT
router.post('/register/seller', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      businessName,
      businessType,
      taxId,
      establishmentDate,
      businessAddress,
      annualTurnover,
      website,
      description
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user with seller role
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      role: 'seller',
      profile: {
        firstName,
        lastName,
        phone,
        gender,
        dateOfBirth
      },
      businessDetails: {
        businessName,
        businessType,
        taxId,
        establishmentDate,
        businessAddress,
        annualTurnover,
        website,
        description,
        isVerified: false // Will be verified after admin approval
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Seller registered successfully! Verification pending.',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isSellerVerified: false,
        businessName: newUser.businessDetails.businessName
      }
    });

  } catch (error) {
    console.error('Seller registration error:', error);
    res.status(500).json({ 
      message: 'Seller registration failed. Please try again.', 
      error: error.message 
    });
  }
});

// Login user - FIXED VERSION
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token and send response
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSellerVerified: user.businessDetails?.isVerified || false,
        businessName: user.businessDetails?.businessName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // This would typically use middleware to verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSellerVerified: user.businessDetails?.isVerified || false,
        businessName: user.businessDetails?.businessName,
        profile: user.profile,
        businessDetails: user.businessDetails
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH profile for current user (update profile or business details)
router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const updates = req.body || {};
    // Only allow specific fields to be updated
    const allowed = ['profile', 'businessDetails', 'phone', 'firstName', 'lastName'];
    const filtered = {};
    Object.keys(updates).forEach((key) => {
      if (allowed.includes(key)) {
        filtered[key] = updates[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.userId, { $set: filtered }, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get my products (for seller dashboard)
router.get('/my-products', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'seller') return res.status(403).json({ message: 'Only sellers can access merchant products' });

    const sellerName = user.businessDetails?.businessName || user.username || user.profile?.firstName + ' ' + user.profile?.lastName;
    const products = await Product.find({ $or: [{ sellerId: user._id }, { seller: { $regex: new RegExp(`^${sellerName}$`, 'i') } }] });
    res.json({ products });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Failed to fetch seller products' });
  }
});

export default router;

// Public list of sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('username email profile businessDetails createdAt');
    res.json({ sellers });
  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({ message: 'Failed to fetch sellers' });
  }
});