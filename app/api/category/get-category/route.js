import { catchError, response } from "@/lib/helperFunction";
import { getCategories } from "@/lib/categoryService";

export async function GET() {
    try {
        const categories = await getCategories()

        if (!categories) {
            return response(false, 404, 'Category not found.')
        }

        return response(true, 200, 'Category found.', categories)

    } catch (error) {
        return catchError(error)
    }
}