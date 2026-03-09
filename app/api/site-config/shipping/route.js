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

        const data = await getSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.SHIPPING);
        return response(true, 200, 'Shipping config found.', data);
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

        const objectIdOrNull = z.union([
            z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid media id.'),
            z.null()
        ])

        const schema = z.object({
            shippingLabelTemplateMedia: objectIdOrNull.optional().default(null),
        });

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error);
        }

        const saved = await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.SHIPPING, validate.data);
        return response(true, 200, 'Shipping config updated.', saved);
    } catch (error) {
        return catchError(error);
    }
}
