import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    barcode: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    mrp: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: true
        }
    ],
    description: {
        type: String,
        required: true
    },
    
    // Configuration for variant attributes
    variantConfig: {
        attributes: [
            {
                key: { type: String },
                label: { type: String },
                required: { type: Boolean, default: true },
                unit: { type: String },
                type: { type: String, enum: ['text', 'number', 'select'], default: 'text' },
                options: [{ type: String }]
            }
        ]
    },
    
    // Additional product attributes
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    
    deletedAt: {
        type: Date,
        default: null,
        index: true
    },

}, { timestamps: true })


productSchema.index({ category: 1 })
const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema, 'products')
export default ProductModel