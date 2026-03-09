import { isAuthenticated } from '@/lib/authentication'
import { catchError, response } from '@/lib/helperFunction'
import { getSiteConfigGroup, setSiteConfigGroup } from '@/lib/getSiteConfig'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  contactUs: z
    .object({
      heading: z.string().optional().default(''),
      addressLine1: z.string().optional().default(''),
      addressLine2: z.string().optional().default(''),
      city: z.string().optional().default(''),
      state: z.string().optional().default(''),
      pincode: z.string().optional().default(''),
      country: z.string().optional().default(''),
      phone: z.string().optional().default(''),
      email: z.string().optional().default(''),
      website: z.string().optional().default(''),
      mapUrl: z.string().optional().default(''),
      workingHours: z.string().optional().default(''),
    })
    .optional()
    .default({}),
})

export async function GET() {
  try {
    const config = await getSiteConfigGroup('contact_us')
    return response(true, 200, 'Contact us config fetched successfully.', config)
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

    const body = await request.json()
    const validate = schema.safeParse(body)

    if (!validate.success) {
      return response(false, 400, 'Invalid or missing fields.', validate.error)
    }

    const result = await setSiteConfigGroup('contact_us', validate.data)
    return response(true, 200, 'Contact us config saved successfully.', result)
  } catch (error) {
    return catchError(error)
  }
}
