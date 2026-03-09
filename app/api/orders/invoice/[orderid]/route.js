import React from "react";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import InvoiceDocument from "@/lib/react-pdf/InvoiceDocument";
import { renderPdfResponse } from "@/lib/react-pdf/renderPdf";
import OrderModel from "@/models/Order.model";

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
    try {
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
        const element = React.createElement(InvoiceDocument, { order, config });
        return await renderPdfResponse({ element, filename: `invoice-${order.order_id}.pdf` });
    } catch (error) {
        return catchError(error);
    }
}
