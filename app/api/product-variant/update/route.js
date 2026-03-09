import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import ProductVariantModel from "@/models/ProductVariant.model"

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        if (!payload._id) {
            return response(false, 400, 'Required field: _id')
        }
        if (!payload.product || !payload.sku || !payload.mrp || !payload.sellingPrice) {
            return response(false, 400, 'Required fields: product, sku, mrp, sellingPrice')
        }
        if (!payload.attributes || Object.keys(payload.attributes).length === 0) {
            return response(false, 400, 'At least one variant attribute is required')
        }
        if (!payload.media || payload.media.length === 0) {
            return response(false, 400, 'At least one media item is required')
        }

        const getProductVariant = await ProductVariantModel.findOne({ deletedAt: null, _id: payload._id })
        if (!getProductVariant) {
            return response(false, 404, 'Data not found.')
        }

        getProductVariant.product = payload.product
        getProductVariant.name = typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : undefined
        getProductVariant.barcode = typeof payload.barcode === 'string' && payload.barcode.trim() ? payload.barcode.trim() : undefined
        getProductVariant.attributes = payload.attributes
        getProductVariant.sku = payload.sku
        getProductVariant.mrp = Number(payload.mrp)
        getProductVariant.sellingPrice = Number(payload.sellingPrice)
        getProductVariant.discountPercentage = Number(payload.discountPercentage) || 0
        getProductVariant.stock = Number(payload.stock) || 0
        getProductVariant.media = payload.media
        await getProductVariant.save()

        return response(true, 200, 'Product variant updated successfully.')

    } catch (error) {
        return catchError(error)
    }
}