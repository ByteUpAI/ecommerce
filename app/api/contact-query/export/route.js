import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ContactQueryModel from "@/models/ContactQuery.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const filter = {
            deletedAt: null
        }

        const data = await ContactQueryModel.find(filter)
            .select('supportId email phone query status createdAt updatedAt')
            .sort({ createdAt: -1 })
            .lean()

        if (!data || data.length === 0) {
            return response(false, 404, 'Collection empty.')
        }

        return response(true, 200, 'Data found.', data)

    } catch (error) {
        return catchError(error)
    }
}
