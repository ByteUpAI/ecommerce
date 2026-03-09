import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

// DEPRECATED: This endpoint returns dynamic attributes now instead of just colors
// For backward compatibility, returns attribute values for any "color" attribute
export async function GET() {
    try {
        await connectDB()

        // Get all variants and extract color attribute if exists
        const variants = await ProductVariantModel.find({ deletedAt: null }).lean()
        
        const colors = new Set()
        variants.forEach(variant => {
            if (variant.attributes) {
                const attrs = variant.attributes instanceof Map 
                    ? Object.fromEntries(variant.attributes) 
                    : variant.attributes
                
                if (attrs.color) {
                    colors.add(attrs.color)
                }
            }
        })

        const colorArray = Array.from(colors).sort()

        if (!colorArray.length) {
            return response(false, 404, 'No color attributes found.')
        }

        return response(true, 200, 'Colors found.', colorArray)

    } catch (error) {
        return catchError(error)
    }
}