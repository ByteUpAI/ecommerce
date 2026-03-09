import { MailtrapClient } from 'mailtrap'

let mailtrapClient = null

const getMailtrapClient = () => {
    const token = process.env.MAILTRAP_TOKEN
    if (!token) {
        throw new Error('MAILTRAP_TOKEN is not configured.')
    }

    if (!mailtrapClient) {
        mailtrapClient = new MailtrapClient({ token })
    }

    return mailtrapClient
}

const stripHtml = (value) => {
    if (!value) return ''
    return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export const sendMail = async (subject, receiver, body) => {
    try {
        const senderEmail = process.env.MAILTRAP_SENDER_EMAIL
        const senderName = process.env.MAILTRAP_SENDER_NAME || 'Mailtrap'
        if (!senderEmail) {
            throw new Error('MAILTRAP_SENDER_EMAIL is not configured.')
        }

        const recipients = String(receiver || '')
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean)
            .map((email) => ({ email }))

        if (!recipients.length) {
            throw new Error('Receiver email is required.')
        }

        const client = getMailtrapClient()

        await client.send({
            from: {
                email: senderEmail,
                name: senderName,
            },
            to: recipients,
            subject,
            html: body,
            text: stripHtml(body),
            category: process.env.MAILTRAP_CATEGORY || 'Integration Test',
        })

        return { success: true }
    } catch (error) {
        return { success: false, message: error.message }
    }
}