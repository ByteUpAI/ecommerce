import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    name: {
        type: String,
        trim: true,
        default: null,
    },
    barcode: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },

    // Flexible attributes using Map - supports any key-value pairs
    attributes: {
        type: Map,
        of: String,
        default: {}
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
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: true
        }
    ],

    deletedAt: {
        type: Date,
        default: null,
        index: true
    },

}, { timestamps: true })


const ProductVariantModel = mongoose.models.ProductVariant || mongoose.model('ProductVariant', ProductVariantSchema, 'productvariants')
export default ProductVariantModel