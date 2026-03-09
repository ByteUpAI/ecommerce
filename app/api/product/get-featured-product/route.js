import { catchError, response } from "@/lib/helperFunction";
import { getFeaturedProducts } from "@/lib/productService";

export async function GET() {
    try {
        const products = await getFeaturedProducts(8);

        if (!products || products.length === 0) {
            return response(false, 404, 'Product not found.')
        }

        return response(true, 200, 'Product found.', products)

    } catch (error) {
        return catchError(error)
    }
}