import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ContactQueryModel from "@/models/ContactQuery.model";
import { z } from "zod";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const payload = await request.json()

        const schema = z.object({
            ids: z.array(z.string().min(3)).min(1),
            status: z.enum(['pending', 'resolved', 'replied', 'blocked']),
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const { ids, status } = validate.data

        const data = await ContactQueryModel.find({ _id: { $in: ids } }).select('_id').lean()
        if (!data.length) {
            return response(false, 404, 'Data not found.')
        }

        await ContactQueryModel.updateMany({ _id: { $in: ids } }, { $set: { status } })

        return response(true, 200, 'Status updated.')

    } catch (error) {
        return catchError(error)
    }
}
