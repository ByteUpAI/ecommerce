import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { getMergedSiteConfig } from "@/lib/getSiteConfig";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import ContactQueryModel from "@/models/ContactQuery.model";
import { z } from "zod";

const SUPPORT_ID_LENGTH = 10
const SUPPORT_ID_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const generateSupportId = () => {
    let id = ''
    for (let i = 0; i < SUPPORT_ID_LENGTH; i += 1) {
        id += SUPPORT_ID_CHARSET.charAt(Math.floor(Math.random() * SUPPORT_ID_CHARSET.length))
    }
    return id
}

export async function POST(request) {
    try {
        await connectDB()

        const payload = await request.json()

        const schema = zSchema.pick({
            email: true,
            phone: true
        }).extend({
            query: z.string().min(3, 'Query is required.')
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const { email, phone, query } = validate.data

        let supportId = null
        for (let i = 0; i < 10; i += 1) {
            const candidate = generateSupportId()
            const exists = await ContactQueryModel.exists({ supportId: candidate })
            if (!exists) {
                supportId = candidate
                break
            }
        }

        if (!supportId) {
            throw new Error('Failed to generate support ID. Please try again.')
        }

        const doc = new ContactQueryModel({
            supportId,
            email,
            phone,
            query,
            status: 'pending'
        })

        await doc.save()

        const config = await getMergedSiteConfig({ includeLegacyFallback: true })
        const isMailConfigured = !!(process.env.MAILTRAP_TOKEN && process.env.MAILTRAP_SENDER_EMAIL)
        const adminRecipients = (config?.contactNotificationEmails?.length ? config.contactNotificationEmails : [process.env.MAILTRAP_DEFAULT_TO])
            .filter(Boolean)
            .join(',')

        const adminBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>New Contact Query</h2>
                <p><strong>Support ID:</strong> ${supportId}</p>
                <p><strong>Status:</strong> pending</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Query:</strong></p>
                <p style="white-space: pre-wrap;">${query}</p>
            </div>
        `

        if (isMailConfigured && adminRecipients) {
            try {
                await sendMail(`New Contact Query - ${supportId}`, adminRecipients, adminBody)
            } catch (error) { }
        }

        if (isMailConfigured && config?.sendContactCopyToUser) {
            const userBody = `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>We received your query</h2>
                    <p>Your support ID is <strong>${supportId}</strong>.</p>
                    <p>We will get back to you as soon as possible.</p>
                    <hr />
                    <p><strong>Your submitted details</strong></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Query:</strong></p>
                    <p style="white-space: pre-wrap;">${query}</p>
                </div>
            `
            try {
                await sendMail(`Contact Query Received - ${supportId}`, email, userBody)
            } catch (error) { }
        }

        return response(true, 200, 'Your query has been submitted successfully.', { supportId })
    } catch (error) {
        return catchError(error)
    }
}
