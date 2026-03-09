import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import { sendMail } from "@/lib/sendMail";
import { getOrderStatusLabel } from "@/lib/orderStatusText";
import OrderModel from "@/models/Order.model";
import { orderPlacedUserEmail } from "@/email/orderPlacedUserEmail";

export async function PUT(request) {
    try {

        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const { _id, status } = await request.json()

        if (!_id || !status) {
            return response(false, 400, 'Order id and status are required.')
        }

        const orderData = await OrderModel.findById(_id)

        if (!orderData) {
            return response(false, 404, 'Order not found.')
        }

        orderData.status = status
        await orderData.save()

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || '';
            const orderDetailsUrl = `${baseUrl}/order-details/${orderData.order_id}`;
            const invoiceUrl = `${baseUrl}/api/orders/invoice/${orderData.order_id}`;

            let config = null;
            try {
                config = await getMergedSiteConfig({ populateMedia: true, includeLegacyFallback: true });
            } catch (e) {
                config = null;
            }

            const statusLabel = getOrderStatusLabel(status);

            await sendMail(
                `Order status updated (${statusLabel})`,
                orderData.email,
                orderPlacedUserEmail({
                    order_id: orderData.order_id,
                    orderDetailsUrl,
                    invoiceUrl,
                    name: orderData.name,
                    totalAmount: orderData.totalAmount,
                    status,
                    config,
                })
            )
        } catch (error) {
            console.log(error)
        }

        return response(true, 200, 'Order status updated successfully.', orderData)

    } catch (error) {
        return catchError(error)
    }
}