import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        default: 'MSME/Artisan'
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    inStock: {
        type: Boolean,
        default: true
    },
    // NEW FIELDS FOR RECOMMENDATIONS
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    originalPrice: {
        type: Number
    },
    originState: {
        type: String,
        default: ''
    },
    indiaPostOptimized: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    popular: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Add index for better performance on recommendations
productSchema.index({ category: 1, rating: -1 });
productSchema.index({ featured: 1 });
productSchema.index({ originState: 1 });

export default mongoose.model('Product', productSchema);