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

        const data = await getSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.BANK);
        return response(true, 200, 'Bank config found.', data);
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

        const accountNumberOrEmpty = z.union([
            z.string().regex(/^\d{9,18}$/, 'Account number must be 9 to 18 digits.'),
            z.literal('')
        ]);
        const ifscOrEmpty = z.union([
            z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC.'),
            z.literal('')
        ]);
        const upiOrEmpty = z.union([
            z.string().regex(/^[\w.\-]{2,256}@[\w]{2,64}$/, 'Invalid UPI ID.'),
            z.literal('')
        ]);

        const schema = z.object({
            bankDetails: z.object({
                accountName: z.string().trim().optional().default(''),
                accountNumber: accountNumberOrEmpty.optional().default(''),
                bankName: z.string().trim().optional().default(''),
                ifsc: ifscOrEmpty.optional().default(''),
                branch: z.string().trim().optional().default(''),
                upiId: upiOrEmpty.optional().default(''),
            }).optional().default({}),
        });

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error);
        }

        const saved = await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.BANK, validate.data);
        return response(true, 200, 'Bank config updated.', saved);
    } catch (error) {
        return catchError(error);
    }
}
