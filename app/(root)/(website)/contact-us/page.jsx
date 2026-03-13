// export default ContactUsPage

'use client'

import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatWebsiteUrl, normalizeContactInfo, splitPhones, FALLBACK_CONTACT_INFO } from '@/lib/contactInfo'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

const breadcrumb = {
  title: 'Contact Us',
  links: [{ label: 'Contact Us' }],
}

const ContactUsPage = () => {
  const [loading, setLoading] = useState(false)
  const [contactForm, setContactForm] = useState({ email: '', phone: '', query: '' })
  const [contactInfo, setContactInfo] = useState(FALLBACK_CONTACT_INFO)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/site-config/contact-us')
        const normalized = normalizeContactInfo(data?.data?.contactUs || {})
        setContactInfo(normalized.info)
      } catch (e) {
        setContactInfo(FALLBACK_CONTACT_INFO)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: res } = await axios.post('/api/contact', contactForm)
      if (!res.success) throw new Error(res.message)
      const supportId = res?.data?.supportId
      showToast('success', supportId ? `${res.message} Support ID: ${supportId}` : res.message)
      setContactForm({ email: '', phone: '', query: '' })
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  const fullAddress = [
    contactInfo?.addressLine1,
    contactInfo?.addressLine2,
    contactInfo?.city,
    contactInfo?.state,
    contactInfo?.pincode,
    contactInfo?.country,
  ].filter(Boolean).join(', ')

  const phones = splitPhones(contactInfo?.phone)

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      {/* Two-column section: Form + Contact Info */}
      <section className="lg:pb-24 pb-12 md:pb-18 px-3 lg:px-8 xl:px-0 mt-10">
        <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-white p-10 shadow">
              <div className="flex flex-col gap-y-4">

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">
                    Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="h-11"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="p_number" className="block mb-1 text-sm font-medium text-gray-800">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    id="p_number"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-11"
                  />
                </div>

                {/* Your Questions */}
                <div>
                  <label htmlFor="your_question" className="block mb-1 text-sm font-medium text-gray-800">
                    Your Questions
                  </label>
                  <Textarea
                    id="your_question"
                    rows={5}
                    value={contactForm.query}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, query: e.target.value }))}
                    className="min-h-[140px]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Send Message"
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 cursor-pointer transition"
                />
              </div>
            </form>

            {/* Contact Info */}
            <div className="bg-white p-10 shadow flex flex-col justify-between">

              {/* Address */}
              {fullAddress ? (
                <div className="w-full flex gap-5">
                  <div className="min-w-7 max-w-7 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <p className="text-gray-700">{fullAddress}</p>
                </div>
              ) : null}

              {/* Phone */}
              {phones.length ? (
                <div className="w-full flex gap-5">
                  <div className="min-w-7 max-w-7 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    {phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-yellow-500 transition text-gray-700">
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Email */}
              {contactInfo?.email ? (
                <div className="w-full flex gap-5">
                  <div className="min-w-7 max-w-7 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-yellow-500 transition text-gray-700">
                    {contactInfo.email}
                  </a>
                </div>
              ) : null}

              {/* Website */}
              {contactInfo?.website ? (
                <div className="w-full flex gap-5">
                  <div className="min-w-7 max-w-7 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <a
                    href={formatWebsiteUrl(contactInfo.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-500 transition text-gray-700"
                  >
                    {contactInfo.website}
                  </a>
                </div>
              ) : null}

              {/* Working Hours */}
              {contactInfo?.workingHours ? (
                <div className="w-full flex gap-5">
                  <div className="min-w-7 max-w-7 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                    </svg>
                  </div>
                  <p className="text-gray-700">{contactInfo.workingHours}</p>
                </div>
              ) : null}

              {/* Google Maps Link */}
              {contactInfo?.mapUrl ? (
                <div className="w-full flex gap-5">
                  <div className="min-w-7 max-w-7 pt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
                    </svg>
                  </div>
                  <a
                    href={contactInfo.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-500 transition text-gray-700"
                  >
                    Open in Google Maps
                  </a>
                </div>
              ) : null}

            </div>
          </div>
        </div>
      </section>

      {/* Full-width Google Map */}
      <section>
        <div className="w-full">
          <iframe
            src={
              contactInfo?.mapEmbed ||
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20778.46631280551!2d72.61396814278426!3d22.98156496784982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84250671ad99%3A0xd9e30aa858fc2a!2sAIR%20CONTROL%20INDUSTRIES%20-JANATICS-FESTO-UFLOW-SMC-KITZ-BRASS%20FITTINGS!5e0!3m2!1sen!2sin!4v1772258650544!5m2!1sen!2sin'
            }
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </div>
      </section>
    </div>
  )
}

export default ContactUsPage