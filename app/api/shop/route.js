import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET(request) {
    try {
        await connectDB()

        const searchParams = request.nextUrl.searchParams

        // Get filters from query params
        const minPrice = parseInt(searchParams.get('minPrice')) || 0
        const maxPrice = parseInt(searchParams.get('maxPrice')) || 100000
        const categorySlug = searchParams.get('category')
        const search = searchParams.get('q')

        // Get dynamic attribute filters (e.g., ?attr_diameter=32&attr_color=Blue)
        const attributeFilters = {}
        for (const [key, value] of searchParams.entries()) {
            if (key.startsWith('attr_')) {
                const attrKey = key.replace('attr_', '')
                attributeFilters[attrKey] = value.split(',')
            }
        }

        // Pagination
        const limit = parseInt(searchParams.get('limit')) || 9
        const page = parseInt(searchParams.get('page')) || 0
        const skip = page * limit

        // Sorting
        const sortOption = searchParams.get('sort') || 'default_sorting'
        let sortquery = {}
        if (sortOption === 'default_sorting') sortquery = { createdAt: -1 }
        if (sortOption === 'asc') sortquery = { name: 1 }
        if (sortOption === 'desc') sortquery = { name: -1 }
        if (sortOption === 'price_low_high') sortquery = { sellingPrice: 1 }
        if (sortOption === 'price_high_low') sortquery = { sellingPrice: -1 }

        // Find category by slug
        let categoryId = []
        if (categorySlug) {
            const slugs = categorySlug.split(',')
            const categoryData = await CategoryModel.find({ deletedAt: null, slug: { $in: slugs } }).select('_id').lean()
            categoryId = categoryData.map(category => category._id)
        }

        // Build match stage
        let matchStage = { deletedAt: null }
        if (categoryId.length > 0) matchStage.category = { $in: categoryId }
        if (search) matchStage.name = { $regex: search, $options: 'i' }

        // Get products
        const products = await ProductModel.find(matchStage)
            .sort(sortquery)
            .skip(skip)
            .limit(limit + 1)
            .populate('media')
            .lean()

        // For each product, get matching variants
        const productsWithVariants = []
        for (const product of products) {
            // Build variant filter
            const variantFilter = {
                product: product._id,
                deletedAt: null,
                sellingPrice: { $gte: minPrice, $lte: maxPrice }
            }

            // Add dynamic attribute filters
            for (const [attrKey, attrValues] of Object.entries(attributeFilters)) {
                variantFilter[`attributes.${attrKey}`] = { $in: attrValues }
            }

            // Get variants
            const variants = await ProductVariantModel.find(variantFilter)
                .select('attributes mrp sellingPrice discountPercentage sku stock')
                .lean()

            // Only include product if it has matching variants
            if (variants.length > 0) {
                // Convert Map to object for variants
                const variantsWithAttrs = variants.map(v => ({
                    ...v,
                    attributes: v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes
                }))

                productsWithVariants.push({
                    ...product,
                    variants: variantsWithAttrs
                })
            }
        }

        // Check if more data exists
        let nextPage = null
        if (productsWithVariants.length > limit) {
            nextPage = page + 1
            productsWithVariants.pop()
        }

        return response(true, 200, 'Product data found.', { products: productsWithVariants, nextPage })

    } catch (error) {
        return catchError(error)
    }
}
