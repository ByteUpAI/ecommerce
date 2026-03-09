import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { getOrderStatusLabel } from "@/lib/orderStatusText";
import OrderModel from "@/models/Order.model";
import crypto from "crypto";
import { z } from "zod";
import { orderPlacedAdminEmail } from "@/email/orderPlacedAdminEmail";
import { orderPlacedUserEmail } from "@/email/orderPlacedUserEmail";

const generateOrderId = async () => {
    for (let i = 0; i < 10; i += 1) {
        const ts = Date.now().toString(36).toUpperCase();
        const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
        const order_id = `ORD-${ts}-${rand}`;
        const exists = await OrderModel.exists({ order_id });
        if (!exists) return order_id;
    }
    return `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
};

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();

        const auth = await isAuthenticated('user');

        const productSchema = z.object({
            productId: z.string().length(24, 'Invalid product id format'),
            variantId: z.string().length(24, 'Invalid variant id format'),
            name: z.string().min(1),
            qty: z.number().min(1),
            mrp: z.number().nonnegative(),
            sellingPrice: z.number().nonnegative()
        });

        const orderSchema = zSchema.pick({
            name: true,
            email: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            pincode: true,
            landmark: true,
            ordernote: true
        }).extend({
            subtotal: z.number().nonnegative(),
            discount: z.number().nonnegative(),
            couponDiscountAmount: z.number().nonnegative(),
            totalAmount: z.number().nonnegative(),
            products: z.array(productSchema)
        });

        const validate = orderSchema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', { error: validate.error });
        }

        const validatedData = validate.data;

        const order_id = await generateOrderId();

        const newOrder = await OrderModel.create({
            user: auth?.isAuth ? auth.userId : undefined,
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            country: validatedData.country,
            state: validatedData.state,
            city: validatedData.city,
            pincode: validatedData.pincode,
            landmark: validatedData.landmark,
            ordernote: validatedData.ordernote,
            products: validatedData.products,
            discount: validatedData.discount,
            couponDiscountAmount: validatedData.couponDiscountAmount,
            totalAmount: validatedData.totalAmount,
            subtotal: validatedData.subtotal,
            payment_id: null,
            order_id,
            status: 'pending'
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const orderDetailsUrl = `${baseUrl}/order-details/${order_id}`;
        const invoiceUrl = `${baseUrl}/api/orders/invoice/${order_id}`;

        let config = null;
        try {
            config = await getMergedSiteConfig({ populateMedia: true, includeLegacyFallback: true });
        } catch (e) {
            config = null;
        }

        try {
            const status = 'pending';
            await sendMail(
                `Order placed successfully (${getOrderStatusLabel(status)})`,
                validatedData.email,
                orderPlacedUserEmail({
                    order_id,
                    orderDetailsUrl,
                    invoiceUrl,
                    name: validatedData.name,
                    totalAmount: validatedData.totalAmount,
                    status,
                    config,
                })
            );
        } catch (error) {
            console.log(error);
        }

        try {
            const recipients = (config?.orderNotificationEmails || []).filter(Boolean);
            const receiver = recipients.length ? recipients.join(',') : process.env.MAILTRAP_DEFAULT_TO;

            if (receiver) {
                await sendMail(
                    `New order received: ${order_id}`,
                    receiver,
                    orderPlacedAdminEmail({
                        order_id,
                        orderDetailsUrl,
                        invoiceUrl,
                        config,
                        order: {
                            name: validatedData.name,
                            email: validatedData.email,
                            phone: validatedData.phone,
                            country: validatedData.country,
                            state: validatedData.state,
                            city: validatedData.city,
                            pincode: validatedData.pincode,
                            landmark: validatedData.landmark,
                            ordernote: validatedData.ordernote,
                            products: validatedData.products,
                            subtotal: validatedData.subtotal,
                            discount: validatedData.discount,
                            couponDiscountAmount: validatedData.couponDiscountAmount,
                            totalAmount: validatedData.totalAmount,
                            status: 'pending'
                        }
                    })
                );
            }
        } catch (error) {
            console.log(error);
        }

        return response(true, 200, 'Your order has been placed successfully and is pending confirmation.', { order_id, _id: newOrder?._id });
    } catch (error) {
        return catchError(error);
    }
}
