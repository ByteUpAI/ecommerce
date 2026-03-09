import { isAuthenticated } from '@/lib/authentication'
import { catchError, response } from '@/lib/helperFunction'
import { getSiteConfigGroup, setSiteConfigGroup } from '@/lib/getSiteConfig'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  termsAndConditions: z
    .object({
      markdown: z.string().optional().default(''),
    })
    .optional()
    .default({}),
})

export async function GET() {
  try {
    const config = await getSiteConfigGroup('terms_and_conditions')
    return response(true, 200, 'Terms config fetched successfully.', config)
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

    const result = await setSiteConfigGroup('terms_and_conditions', validate.data)
    return response(true, 200, 'Terms config saved successfully.', result)
  } catch (error) {
    return catchError(error)
  }
}
