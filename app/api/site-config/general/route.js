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

        const data = await getSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.GENERAL);
        return response(true, 200, 'General config found.', data);
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

        const schema = z.object({
            sendContactCopyToUser: z.boolean().optional().default(false),
        });

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error);
        }

        const saved = await setSiteConfigGroup(SITE_CONFIG_GROUP_KEYS.GENERAL, validate.data);
        return response(true, 200, 'General config updated.', saved);
    } catch (error) {
        return catchError(error);
    }
}
