import React from "react";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import { catchError } from "@/lib/helperFunction";
import ShippingLabelDocument from "@/lib/react-pdf/ShippingLabelDocument";
import { renderPdfResponse } from "@/lib/react-pdf/renderPdf";
import OrderModel from "@/models/Order.model";

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return new Response('Unauthorized', { status: 403 });
        }

        await connectDB();
        const orderid = (await params)?.orderid;

        if (!orderid) {
            return new Response('Order not found', { status: 404 });
        }

        const order = await OrderModel.findOne({ order_id: orderid, deletedAt: null }).lean();
        if (!order) {
            return new Response('Order not found', { status: 404 });
        }

        const config = await getMergedSiteConfig({ populateMedia: true, includeLegacyFallback: true });
        const element = React.createElement(ShippingLabelDocument, { order, config });
        return await renderPdfResponse({ element, filename: `shipping-label-${order.order_id}.pdf` });
    } catch (error) {
        return catchError(error);
    }
}
