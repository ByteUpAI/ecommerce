import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import ProductVariantModel from "@/models/ProductVariant.model"

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        // Validate required fields
        if (!payload.product || !payload.sku || !payload.mrp || !payload.sellingPrice) {
            return response(false, 400, 'Required fields: product, sku, mrp, sellingPrice')
        }

        if (!payload.attributes || Object.keys(payload.attributes).length === 0) {
            return response(false, 400, 'At least one variant attribute is required')
        }

        if (!payload.media || payload.media.length === 0) {
            return response(false, 400, 'At least one media item is required')
        }

        const newProductVariant = new ProductVariantModel({
            product: payload.product,
            name: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : undefined,
            barcode: typeof payload.barcode === 'string' && payload.barcode.trim() ? payload.barcode.trim() : undefined,
            attributes: payload.attributes,
            sku: payload.sku,
            mrp: Number(payload.mrp),
            sellingPrice: Number(payload.sellingPrice),
            discountPercentage: Number(payload.discountPercentage) || 0,
            stock: Number(payload.stock) || 0,
            media: payload.media,
        })

        await newProductVariant.save()

        return response(true, 200, 'Product Variant added successfully.')

    } catch (error) {
        return catchError(error)
    }
}