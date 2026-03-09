import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectDB } from "./databaseConnection"
import UserModel from "@/models/User.model"
export const isAuthenticated = async (role) => {
    try {
        const cookieStore = await cookies()
        if (!cookieStore.has('access_token')) {
            return {
                isAuth: false
            }
        }

        const access_token = cookieStore.get('access_token')
        const { payload } = await jwtVerify(access_token.value, new TextEncoder().encode(process.env.SECRET_KEY))

        await connectDB()
        const user = await UserModel.findOne({ _id: payload._id, deletedAt: null }).select('_id role isBlocked').lean()
        if (!user || user.isBlocked) {
            cookieStore.delete('access_token')
            return {
                isAuth: false
            }
        }

        if (payload.role !== role) {
            return {
                isAuth: false
            }
        }

        return {
            isAuth: true,
            userId: payload._id
        }

    } catch (error) {
        try {
            const cookieStore = await cookies()
            cookieStore.delete('access_token')
        } catch (e) {
            e?.message
        }
        return {
            isAuth: false,
            error
        }
    }
}
