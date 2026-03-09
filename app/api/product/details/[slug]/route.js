import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.model";

export async function GET(request, { params }) {
    try {

        await connectDB()

        const getParams = await params
        const slug = getParams.slug

        const searchParams = request.nextUrl.searchParams

        const filter = {
            deletedAt: null
        }

        if (!slug) {
            return response(false, 404, 'Product not found.')
        }

        filter.slug = slug

        // get product 
        const getProduct = await ProductModel.findOne(filter).populate('media', 'secure_url').lean()

        if (!getProduct) {
            return response(false, 404, 'Product not found.')
        }

        // Build variant filter from dynamic attributes in query params
        const variantFilter = {
            product: getProduct._id,
            deletedAt: null
        }

        // If product has variantConfig, build attribute filters from query params
        const variantConfig = getProduct.variantConfig
        const selectedAttributes = {}
        if (variantConfig?.attributes && Array.isArray(variantConfig.attributes)) {
            variantConfig.attributes.forEach(attr => {
                const paramValue = searchParams.get(attr.key)
                if (paramValue) {
                    selectedAttributes[attr.key] = paramValue
                    variantFilter[`attributes.${attr.key}`] = paramValue
                }
            })
        }

        // Find variant matching selected attributes, or first variant if none selected
        let variant = await ProductVariantModel.findOne(variantFilter).populate('media', 'secure_url').lean()
        
        if (!variant) {
            // If no exact match, try to find first available variant
            variant = await ProductVariantModel.findOne({ product: getProduct._id, deletedAt: null }).populate('media', 'secure_url').lean()
        }

        if (!variant) {
            return response(false, 404, 'Product not found.')
        }

        // Get available options for each dynamic attribute
        const attributeOptions = {}
        if (variantConfig?.attributes && Array.isArray(variantConfig.attributes)) {
            for (const attr of variantConfig.attributes) {
                const distinctValues = await ProductVariantModel.distinct(
                    `attributes.${attr.key}`,
                    { product: getProduct._id, deletedAt: null }
                )
                attributeOptions[attr.key] = distinctValues.filter(Boolean)
            }
        }

        const variants = await ProductVariantModel.find({ product: getProduct._id, deletedAt: null })
            .select('_id attributes stock')
            .lean()

        // get review  

        const review = await ReviewModel.countDocuments({ product: getProduct._id })

        const productData = {
            product: getProduct,
            variant: variant,
            attributeOptions: attributeOptions,
            variants: variants,
            selectedAttributes: selectedAttributes,
            reviewCount: review
        }

        return response(true, 200, 'Product data found.', productData)

    } catch (error) {
        return catchError(error)
    }
}