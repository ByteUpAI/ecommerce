import React from "react";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import ShippingLabelDocument from "@/lib/react-pdf/ShippingLabelDocument";
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
            name: 'Customer Name',
            phone: '9999999999',
            landmark: '123 Example Street, Near Landmark',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411001',
            country: 'India',
        };

        const element = React.createElement(ShippingLabelDocument, { order: dummyOrder, config });
        return await renderPdfResponse({ element, filename: 'shipping-label-preview.pdf' });
    } catch (error) {
        return catchError(error);
    }
}
