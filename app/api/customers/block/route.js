import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
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
            isBlocked: z.boolean(),
        })

        const validated = schema.safeParse(payload)
        if (!validated.success) {
            return response(false, 400, 'Invalid or missing fields.', validated.error)
        }

        const { ids, isBlocked } = validated.data

        if (ids.includes(auth.userId)) {
            return response(false, 400, 'You cannot block/unblock your own account.')
        }

        const data = await UserModel.find({ _id: { $in: ids }, deletedAt: null, role: 'user' }).select('_id').lean()
        if (!data.length) {
            return response(false, 404, 'Data not found.')
        }

        await UserModel.updateMany({ _id: { $in: ids }, role: 'user' }, { $set: { isBlocked } })

        return response(true, 200, isBlocked ? 'User blocked.' : 'User unblocked.')

    } catch (error) {
        return catchError(error)
    }
}
