import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";
import ProductModel from "@/models/Product.model";
import CategoryModel from "@/models/Category.model";

export async function GET(request) {
    try {
        await connectDB()

        const searchParams = request.nextUrl.searchParams
        const categorySlug = searchParams.get('category')

        let productFilter = { deletedAt: null }

        // If category is specified, filter products by category
        if (categorySlug) {
            const slugs = categorySlug.split(',')
            const categories = await CategoryModel.find({ 
                deletedAt: null, 
                slug: { $in: slugs } 
            }).select('_id').lean()
            
            const categoryIds = categories.map(cat => cat._id)
            
            if (categoryIds.length > 0) {
                const products = await ProductModel.find({ 
                    deletedAt: null,
                    category: { $in: categoryIds }
                }).select('_id').lean()
                
                const productIds = products.map(p => p._id)
                
                // Get variants only for products in selected categories
                const variants = await ProductVariantModel.find({ 
                    deletedAt: null,
                    product: { $in: productIds }
                }).lean()

                const attributesMap = extractAttributes(variants)
                const attributes = formatAttributes(attributesMap)
                
                return response(true, 200, 'Category-specific attributes found.', attributes)
            }
        }

        // If no category filter, return all attributes
        const variants = await ProductVariantModel.find({ deletedAt: null }).lean()
        const attributesMap = extractAttributes(variants)
        const attributes = formatAttributes(attributesMap)

        return response(true, 200, 'Attributes found.', attributes)

    } catch (error) {
        return catchError(error)
    }
}

function extractAttributes(variants) {
    const attributesMap = {}

    variants.forEach(variant => {
        if (variant.attributes) {
            const attrs = variant.attributes instanceof Map 
                ? Object.fromEntries(variant.attributes) 
                : variant.attributes

            Object.entries(attrs).forEach(([key, value]) => {
                if (!attributesMap[key]) {
                    attributesMap[key] = new Set()
                }
                attributesMap[key].add(value)
            })
        }
    })

    return attributesMap
}

function formatAttributes(attributesMap) {
    return Object.entries(attributesMap).map(([key, valuesSet]) => ({
        key,
        label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        values: Array.from(valuesSet).sort()
    }))
}
