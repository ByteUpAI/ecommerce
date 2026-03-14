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
                    .populate({
                        path: 'product',
                        select: 'name slug media variantConfig',
                        populate: {
                            path: 'media',
                            select: 'secure_url',
                        },
                    })
                    .populate('media', 'secure_url')
                    .lean()

                if (!variant || !variant.product) {
                    return null
                }

                const variantMediaUrl = Array.isArray(variant?.media) ? variant?.media?.[0]?.secure_url : undefined
                const productMediaUrl = Array.isArray(variant?.product?.media) ? variant?.product?.media?.[0]?.secure_url : undefined

                if (variant) {
                    return {
                        productId: variant.product._id,
                        variantId: variant._id,
                        name: variant.product.name,
                        url: variant.product.slug,
                        attributes: variant.attributes || {},
                        attributeConfig: variant?.product?.variantConfig?.attributes || [],
                        mrp: variant.mrp,
                        sellingPrice: variant.sellingPrice,
                        media: variantMediaUrl || productMediaUrl,
                        qty: cartItem.qty,
                    }
                }
            })
        )

        return response(true, 200, 'Verified Cart Data.', verifiedCartData.filter(Boolean))

    } catch (error) {
        return catchError(error)
    }
}