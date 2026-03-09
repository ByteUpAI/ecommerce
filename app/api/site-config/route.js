import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import { SITE_CONFIG_GROUP_KEYS, setSiteConfigGroup } from "@/lib/getSiteConfig";
import { z } from "zod";

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        const config = await getMergedSiteConfig({ populateMedia: true, includeLegacyFallback: true })

        return response(true, 200, 'Site config found.', config || null)

    } catch (error) {
        return catchError(error)
    }
}

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const payload = await request.json()

        const schema = z.object({
            contactNotificationEmails: z.array(z.string().email()).optional().default([]),
            orderNotificationEmails: z.array(z.string().email()).optional().default([]),
            invoiceCompany: z.object({
                name: z.string().optional().default(''),
                email: z.string().optional().default(''),
                phone: z.string().optional().default(''),
                gstin: z.string().optional().default(''),
                addressLine1: z.string().optional().default(''),
                addressLine2: z.string().optional().default(''),
                city: z.string().optional().default(''),
                state: z.string().optional().default(''),
                pincode: z.string().optional().default(''),
                country: z.string().optional().default(''),
            }).optional().default({}),
            bankDetails: z.object({
                accountName: z.string().optional().default(''),
                accountNumber: z.string().optional().default(''),
                bankName: z.string().optional().default(''),
                ifsc: z.string().optional().default(''),
                branch: z.string().optional().default(''),
                upiId: z.string().optional().default(''),
            }).optional().default({}),
            invoiceTerms: z.string().optional().default(''),
            invoiceFooterNote: z.string().optional().default(''),
            invoiceTemplateMedia: z.string().nullable().optional().default(null),
            shippingLabelTemplateMedia: z.string().nullable().optional().default(null),
            sendContactCopyToUser: z.boolean().optional().default(false),
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const data = validate.data

        await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.NOTIFICATIONS, {
            contactNotificationEmails: data.contactNotificationEmails,
            orderNotificationEmails: data.orderNotificationEmails,
        });

        await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.BANK, {
            bankDetails: data.bankDetails,
        });

        await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.INVOICE, {
            invoiceCompany: data.invoiceCompany,
            invoiceTerms: data.invoiceTerms,
            invoiceFooterNote: data.invoiceFooterNote,
            invoiceTemplateMedia: data.invoiceTemplateMedia,
        });

        await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.SHIPPING, {
            shippingLabelTemplateMedia: data.shippingLabelTemplateMedia,
        });

        await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.GENERAL, {
            sendContactCopyToUser: data.sendContactCopyToUser,
        });

        const merged = await getMergedSiteConfig({ populateMedia: true, includeLegacyFallback: true });
        return response(true, 200, 'Site config updated.', merged)

    } catch (error) {
        return catchError(error)
    }
}
