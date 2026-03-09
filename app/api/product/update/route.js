import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import { encode } from "entities"

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            _id: true,
            name: true,
            slug: true,
            barcode: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            description: true,
            media: true,
            variantConfig: true
        })
        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const validatedData = validate.data

        const hasVariantConfig = Object.prototype.hasOwnProperty.call(payload || {}, 'variantConfig')
        const rawAttributes = payload?.variantConfig?.attributes
        const normalizedAttributes = Array.isArray(rawAttributes)
            ? rawAttributes
                .map((attr) => {
                    const key = String(attr?.key || '').trim()
                    const label = String(attr?.label || '').trim()
                    if (!key || !label) return null

                    const type = ['text', 'number', 'select'].includes(attr?.type)
                        ? attr.type
                        : 'text'

                    const options = Array.isArray(attr?.options)
                        ? attr.options.map((o) => String(o).trim()).filter(Boolean)
                        : []

                    if (type === 'select' && options.length === 0) return null

                    return {
                        key,
                        label,
                        required: attr?.required !== false,
                        unit: attr?.unit ? String(attr.unit).trim() : '',
                        type,
                        options,
                    }
                })
                .filter(Boolean)
            : []

        const getProduct = await ProductModel.findOne({ deletedAt: null, _id: validatedData._id })
        if (!getProduct) {
            return response(false, 404, 'Data not found.')
        }

        getProduct.name = validatedData.name
        getProduct.slug = validatedData.slug
        getProduct.barcode = typeof validatedData.barcode === 'string' && validatedData.barcode.trim() ? validatedData.barcode.trim() : undefined
        getProduct.category = validatedData.category
        getProduct.mrp = validatedData.mrp
        getProduct.sellingPrice = validatedData.sellingPrice
        getProduct.discountPercentage = validatedData.discountPercentage
        getProduct.description = encode(validatedData.description)
        getProduct.media = validatedData.media
        if (hasVariantConfig) {
            getProduct.variantConfig = {
                attributes: normalizedAttributes,
            }
        }
        await getProduct.save()

        return response(true, 200, 'Product updated successfully.')

    } catch (error) {
        return catchError(error)
    }
}