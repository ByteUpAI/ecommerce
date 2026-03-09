import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import { SITE_CONFIG_GROUP_KEYS, getSiteConfigGroup, setSiteConfigGroup } from "@/lib/getSiteConfig";
import { z } from "zod";

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        const data = await getSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.INVOICE);
        return response(true, 200, 'Invoice config found.', data);
    } catch (error) {
        return catchError(error);
    }
}

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.');
        }

        const payload = await request.json();

        const emailOrEmpty = z.union([z.string().email('Invalid email.'), z.literal('')]);
        const phoneOrEmpty = z.union([
            z.string().regex(/^\d{10,15}$/, 'Phone must be 10 to 15 digits.'),
            z.literal('')
        ]);
        const gstinOrEmpty = z.union([
            z.string().regex(/^[0-9A-Z]{15}$/, 'GSTIN must be 15 characters.'),
            z.literal('')
        ]);
        const pincodeOrEmpty = z.union([
            z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits.'),
            z.literal('')
        ]);

        const objectIdOrNull = z.union([
            z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid media id.'),
            z.null()
        ])

        const schema = z.object({
            invoiceCompany: z.object({
                name: z.string().trim().optional().default(''),
                email: emailOrEmpty.optional().default(''),
                phone: phoneOrEmpty.optional().default(''),
                gstin: gstinOrEmpty.optional().default(''),
                addressLine1: z.string().trim().optional().default(''),
                addressLine2: z.string().trim().optional().default(''),
                city: z.string().trim().optional().default(''),
                state: z.string().trim().optional().default(''),
                pincode: pincodeOrEmpty.optional().default(''),
                country: z.string().trim().optional().default(''),
            }).optional().default({}),
            invoiceTerms: z.string().optional().default(''),
            invoiceFooterNote: z.string().optional().default(''),
            invoiceTemplateMedia: objectIdOrNull.optional().default(null),
        });

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error);
        }

        const saved = await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.INVOICE, validate.data);
        return response(true, 200, 'Invoice config updated.', saved);
    } catch (error) {
        return catchError(error);
    }
}
