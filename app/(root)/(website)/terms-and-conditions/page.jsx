import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { marked } from 'marked'
import React from 'react'

export const dynamic = 'force-dynamic'

const breadcrumb = {
    title: 'Terms & Conditions',
    links: [
        { label: 'Terms & Conditions' },
    ]
}

const TermsAndConditions = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    let termsConfig = null

    try {
        const url = `${baseUrl}/api/site-config/terms-and-conditions`
        const res = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (res.ok) {
            termsConfig = await res.json()
        }
    } catch (e) {
        termsConfig = null
    }

    const markdown = termsConfig?.data?.termsAndConditions?.markdown || ''
    const html = markdown ? marked.parse(markdown) : ''

    return (
        <div>
            <WebsiteBreadcrumb props={breadcrumb} />
            <div className='lg:px-40 px-5 py-20'>
                <h1 className='text-xl font-semibold mb-3'>Terms & Conditions</h1>

                {html ? (
                    <div
                        className='max-w-none'
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                ) : (
                    <p>Terms & Conditions are not configured yet.</p>
                )}
            </div>
        </div>
    )
}

export default TermsAndConditions
