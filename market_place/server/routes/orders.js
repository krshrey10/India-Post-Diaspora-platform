import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, shippingMethod, notes } = req.body;
    
    // Calculate total amount and verify products
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.product}` });
      }
      if (!product.inStock) {
        return res.status(400).json({ error: `Product out of stock: ${product.name}` });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }
    
    // Calculate estimated delivery (7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    
    const order = new Order({
      customer,
      items: orderItems,
      totalAmount,
      shippingMethod: shippingMethod || 'India Post Standard',
      estimatedDelivery,
      notes
    });
    
    const savedOrder = await order.save();
    
    // Populate the order with product details for response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('items.product', 'name image seller category originState');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name image price seller category originState');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get orders by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const orders = await Order.find({ 'customer.email': req.params.email })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(trackingNumber && { trackingNumber })
      },
      { new: true }
    ).populate('items.product', 'name image price');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('items.product', 'name image price');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

export default router;