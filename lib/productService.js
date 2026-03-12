import { connectDB } from "@/lib/databaseConnection";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function getFeaturedProducts(limit = 8) {
    await connectDB();
    const products = await ProductModel.find({ deletedAt: null })
        .populate('media')
        .limit(limit)
        .lean();

    const withDefaultVariant = await Promise.all(
        (products || []).map(async (p) => {
            const variant = await ProductVariantModel.findOne({ product: p._id, deletedAt: null })
                .populate('media', 'secure_url')
                .lean()

            return {
                ...p,
                defaultVariant: variant
                    ? {
                        _id: variant._id,
                        mrp: variant.mrp,
                        sellingPrice: variant.sellingPrice,
                        discountPercentage: variant.discountPercentage,
                        media: Array.isArray(variant.media) ? variant.media : [],
                    }
                    : null,
            }
        })
    )

    return withDefaultVariant;
}
