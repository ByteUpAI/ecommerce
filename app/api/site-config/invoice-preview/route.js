import React from "react";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import InvoiceDocument from "@/lib/react-pdf/InvoiceDocument";
import { renderPdfResponse } from "@/lib/react-pdf/renderPdf";

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return new Response('Unauthorized', { status: 403 });
        }

        await connectDB();

        const config = await getMergedSiteConfig({ populateMedia: true, includeLegacyFallback: true });

        const dummyOrder = {
            order_id: 'ORD-PREVIEW-0001',
            createdAt: new Date().toISOString(),
            status: 'pending',
            name: 'Customer Name',
            email: 'customer@example.com',
            phone: '9999999999',
            landmark: '123 Example Street, Near Landmark',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411001',
            country: 'India',
            products: [
                {
                    productId: '64f000000000000000000001',
                    variantId: '64f000000000000000000101',
                    name: 'Sample Item A',
                    qty: 2,
                    mrp: 249.5,
                    sellingPrice: 199.5,
                },
                {
                    productId: '64f000000000000000000002',
                    variantId: '64f000000000000000000102',
                    name: 'Sample Item B with a longer name',
                    qty: 1,
                    mrp: 599,
                    sellingPrice: 499,
                },
            ],
        };

        dummyOrder.subtotal = dummyOrder.products.reduce((acc, p) => acc + (Number(p.qty) || 0) * (Number(p.mrp) || 0), 0);
        dummyOrder.discount = dummyOrder.products.reduce((acc, p) => acc + (Number(p.qty) || 0) * ((Number(p.mrp) || 0) - (Number(p.sellingPrice) || 0)), 0);
        dummyOrder.couponDiscountAmount = 0;
        dummyOrder.totalAmount = dummyOrder.subtotal - dummyOrder.discount;

        const element = React.createElement(InvoiceDocument, { order: dummyOrder, config });
        return await renderPdfResponse({ element, filename: 'invoice-preview.pdf' });
    } catch (error) {
        return catchError(error);
    }
}
