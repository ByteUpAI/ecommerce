import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const verifiedCartData = await Promise.all(
            payload.map(async (cartItem) => {
                const variant = await ProductVariantModel.findOne({ _id: cartItem.variantId, deletedAt: null })
                    .populate('product', 'name slug')
                    .populate('media', 'secure_url')
                    .lean()
                if (variant && (typeof variant.stock !== 'number' || variant.stock > 0)) {
                    return {
                        productId: variant.product._id,
                        variantId: variant._id,
                        name: variant.product.name,
                        url: variant.product.slug,
                        attributes: variant.attributes || {},
                        mrp: variant.mrp,
                        sellingPrice: variant.sellingPrice,
                        media: variant?.media[0]?.secure_url,
                        qty: cartItem.qty,
                    }
                }
            })
        )


        return response(true, 200, 'Verified Cart Data.', verifiedCartData)

    } catch (error) {
        return catchError(error)
    }
}