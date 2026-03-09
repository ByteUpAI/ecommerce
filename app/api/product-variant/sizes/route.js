import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

// DEPRECATED: This endpoint returns dynamic attributes now instead of just sizes
// For backward compatibility, returns attribute values for any "size" related attributes
export async function GET() {
    try {
        await connectDB()

        // Get all variants and extract size-related attributes
        const variants = await ProductVariantModel.find({ deletedAt: null }).lean()
        
        const sizes = new Set()
        variants.forEach(variant => {
            if (variant.attributes) {
                const attrs = variant.attributes instanceof Map 
                    ? Object.fromEntries(variant.attributes) 
                    : variant.attributes
                
                // Check for common size-related attribute keys
                const sizeKeys = ['size', 'diameter', 'outer_diameter', 'inner_diameter']
                sizeKeys.forEach(key => {
                    if (attrs[key]) {
                        sizes.add(attrs[key])
                    }
                })
            }
        })

        const sizeArray = Array.from(sizes).sort()

        if (!sizeArray.length) {
            return response(false, 404, 'No size attributes found.')
        }

        return response(true, 200, 'Sizes found.', sizeArray)

    } catch (error) {
        return catchError(error)
    }
}