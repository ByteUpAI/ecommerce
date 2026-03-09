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
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/site-config/contact-us')
        const normalized = normalizeContactInfo(data?.data?.contactUs || {})
        setContactInfo(normalized.info)
        setIsConfigured(normalized.isConfigured)
      } catch (e) {
        setContactInfo(FALLBACK_CONTACT_INFO)
        setIsConfigured(false)
      }
    }

    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: res } = await axios.post('/api/contact', contactForm)
      if (!res.success) {
        throw new Error(res.message)
      }
      const supportId = res?.data?.supportId
      showToast('success', supportId ? `${res.message} Support ID: ${supportId}` : res.message)
      setContactForm({ email: '', phone: '', query: '' })
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      <section className='bg-gray-50'>
        <div className='lg:px-40 px-5 pt-16 pb-14'>
          <div className='text-center'>
            <h1 className='text-3xl lg:text-5xl font-black tracking-tight text-gray-900'>Have some questions?</h1>
            <div className='mt-3 text-xs text-gray-500'>
              <span className='uppercase tracking-[0.18em]'>India</span>
              <span className='mx-3 text-gray-300'>•</span>
              <span>
                {[contactInfo?.addressLine1, contactInfo?.addressLine2, contactInfo?.city]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          </div>

          <div className='mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
            <div className='hidden lg:flex justify-center'>
              <svg width='520' height='360' viewBox='0 0 520 360' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M88 126C88 113.85 97.85 104 110 104H410C422.15 104 432 113.85 432 126V282C432 294.15 422.15 304 410 304H110C97.85 304 88 294.15 88 282V126Z' stroke='#1D4ED8' strokeWidth='2'/>
                <path d='M104 142L260 236L416 142' stroke='#1D4ED8' strokeWidth='2'/>
                <path d='M104 282L216 206' stroke='#1D4ED8' strokeWidth='2'/>
                <path d='M416 282L304 206' stroke='#1D4ED8' strokeWidth='2'/>
                <path d='M150 132C150 124.268 156.268 118 164 118H240C247.732 118 254 124.268 254 132V168C254 175.732 247.732 182 240 182H164C156.268 182 150 175.732 150 168V132Z' stroke='#93C5FD' strokeWidth='2'/>
                <path d='M170 148H234' stroke='#93C5FD' strokeWidth='2'/>
                <path d='M170 160H224' stroke='#93C5FD' strokeWidth='2'/>
              </svg>
            </div>

            <div className='rounded-2xl border border-gray-200 bg-white shadow-sm p-6 lg:p-8'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Input
                    type='email'
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="What's your email?"
                    required
                    className='h-11'
                  />
                </div>

                <div>
                  <Input
                    type='tel'
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder='Your phone number'
                    required
                    className='h-11'
                  />
                </div>

                <div>
                  <Textarea
                    value={contactForm.query}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, query: e.target.value }))}
                    placeholder='Your questions...'
                    required
                    className='min-h-[120px]'
                  />
                </div>

                <ButtonLoading
                  loading={loading}
                  type='submit'
                  text='SEND MESSAGE'
                  className='w-full cursor-pointer bg-primary text-black hover:brightness-95 font-semibold'
                />
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-white'>
        <div className='lg:px-40 px-5 py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            <div className='rounded-2xl border border-gray-200 bg-white p-6'>
              <h2 className='text-2xl font-semibold mb-4'>{contactInfo?.heading || 'Contact Information'}</h2>

              <div className='space-y-3 text-gray-600'>
                {(
                  contactInfo?.addressLine1 ||
                  contactInfo?.addressLine2 ||
                  contactInfo?.city ||
                  contactInfo?.state ||
                  contactInfo?.pincode ||
                  contactInfo?.country
                ) ? (
                  <div>
                    <p className='font-medium text-gray-900'>Address</p>
                    <p className='text-sm'>
                      {[contactInfo?.addressLine1, contactInfo?.addressLine2].filter(Boolean).join(', ')}
                      {(contactInfo?.city || contactInfo?.state || contactInfo?.pincode || contactInfo?.country) ? (
                        <>
                          <br />
                          {[contactInfo?.city, contactInfo?.state, contactInfo?.pincode, contactInfo?.country]
                            .filter(Boolean)
                            .join(', ')}
                        </>
                      ) : null}
                    </p>
                  </div>
                ) : null}

                {splitPhones(contactInfo?.phone).length ? (
                  <div>
                    <p className='font-medium text-gray-900'>Phone</p>
                    <div className='text-sm flex flex-col'>
                      {splitPhones(contactInfo.phone).map((phone) => (
                        <a key={phone} className='hover:text-primary' href={`tel:${phone.replace(/\s+/g, '')}`}>
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {contactInfo?.email ? (
                  <div>
                    <p className='font-medium text-gray-900'>Email</p>
                    <a className='text-sm hover:text-primary' href={`mailto:${contactInfo.email}`}>
                      {contactInfo.email}
                    </a>
                  </div>
                ) : null}

                {contactInfo?.website ? (
                  <div>
                    <p className='font-medium text-gray-900'>Website</p>
                    <a
                      className='text-sm hover:text-primary'
                      href={formatWebsiteUrl(contactInfo.website)}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {contactInfo.website}
                    </a>
                  </div>
                ) : null}

                {contactInfo?.workingHours ? (
                  <div>
                    <p className='font-medium text-gray-900'>Working Hours</p>
                    <p className='text-sm'>{contactInfo.workingHours}</p>
                  </div>
                ) : null}

                {contactInfo?.mapUrl ? (
                  <div>
                    <p className='font-medium text-gray-900'>Map</p>
                    <a
                      className='text-sm hover:text-primary'
                      href={contactInfo.mapUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Open in Google Maps
                    </a>
                  </div>
                ) : null}

                {!isConfigured ? (
                  <p className='text-xs text-gray-500 pt-2 border-t'>Using default contact details. Configure from Admin → Page Config → Contact Us.</p>
                ) : null}
              </div>
            </div>

            <div className='rounded-2xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>Quick actions</h3>
              <div className='space-y-2 text-sm text-gray-600'>
                <p>
                  Prefer email?{' '}
                  {contactInfo?.email ? (
                    <a className='font-semibold hover:text-primary' href={`mailto:${contactInfo.email}`}>
                      {contactInfo.email}
                    </a>
                  ) : null}
                </p>
                <p>
                  Prefer phone?{' '}
                  {splitPhones(contactInfo?.phone)[0] ? (
                    <a
                      className='font-semibold hover:text-primary'
                      href={`tel:${splitPhones(contactInfo.phone)[0].replace(/\s+/g, '')}`}
                    >
                      {splitPhones(contactInfo.phone)[0]}
                    </a>
                  ) : null}
                </p>
                {contactInfo?.mapUrl ? (
                  <p>
                    Need directions?{' '}
                    <a className='font-semibold hover:text-primary' href={contactInfo.mapUrl} target='_blank' rel='noopener noreferrer'>
                      Open map
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUsPage
