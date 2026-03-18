import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
                              .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new review
router.post('/', async (req, res) => {
  const review = new Review({
    productId: req.body.productId,
    rating: req.body.rating,
    comment: req.body.comment,
    author: req.body.author,
    authorId: req.body.authorId
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get average rating for a product
router.get('/product/:productId/average', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }
    
    const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    res.json({ average: average.toFixed(1), count: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;