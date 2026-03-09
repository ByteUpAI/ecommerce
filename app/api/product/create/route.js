import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import { encode } from "entities"

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
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

        const productData = validate.data

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

        const newProduct = new ProductModel({
            name: productData.name,
            slug: productData.slug,
            barcode: typeof productData.barcode === 'string' && productData.barcode.trim() ? productData.barcode.trim() : undefined,
            category: productData.category,
            mrp: productData.mrp,
            sellingPrice: productData.sellingPrice,
            discountPercentage: productData.discountPercentage,
            description: encode(productData.description),
            media: productData.media,
            variantConfig: {
                attributes: normalizedAttributes,
            },
        })

        await newProduct.save()

        return response(true, 200, 'Product added successfully.')

    } catch (error) {
        return catchError(error)
    }
}