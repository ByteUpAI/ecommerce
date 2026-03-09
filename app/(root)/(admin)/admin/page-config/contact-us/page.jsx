'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { ADMIN_DASHBOARD, ADMIN_PAGE_CONFIG_CONTACT_US } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PAGE_CONFIG_CONTACT_US, label: 'Page Config' },
  { href: ADMIN_PAGE_CONFIG_CONTACT_US, label: 'Contact Us' },
]

const ContactUsPageConfig = () => {
  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    contactUs: z.object({
      heading: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      mapUrl: z.string().optional(),
      workingHours: z.string().optional(),
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      contactUs: {
        heading: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        phone: '',
        email: '',
        mapUrl: '',
        workingHours: '',
      },
    },
  })

  const { data, error, refetch } = useFetch('/api/site-config/contact-us')

  useEffect(() => {
    if (data?.data?.contactUs) {
      form.setValue('contactUs', {
        heading: data.data.contactUs.heading || '',
        addressLine1: data.data.contactUs.addressLine1 || '',
        addressLine2: data.data.contactUs.addressLine2 || '',
        city: data.data.contactUs.city || '',
        state: data.data.contactUs.state || '',
        pincode: data.data.contactUs.pincode || '',
        country: data.data.contactUs.country || '',
        phone: data.data.contactUs.phone || '',
        email: data.data.contactUs.email || '',
        mapUrl: data.data.contactUs.mapUrl || '',
        workingHours: data.data.contactUs.workingHours || '',
      })
    }
  }, [data, form])

  const save = async () => {
    const values = form.getValues()
    setLoading(true)
    try {
      const { data: res } = await axios.put('/api/site-config/contact-us', values)
      if (!res.success) throw new Error(res.message)
      showToast('success', res.message)
      if (typeof refetch === 'function') {
        await refetch()
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      showToast('error', apiMessage || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <div className='mt-4'>
        <div className='mb-6'>
          <h4 className='text-2xl font-semibold'>Contact Us Page Settings</h4>
          {error ? (
            <div className='mt-2 text-sm text-red-600'>
              {error}
            </div>
          ) : null}
        </div>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className='space-y-5'>
            <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
              <h5 className='font-medium mb-4'>Contact Details</h5>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs text-gray-500 mb-1 block'>Heading</label>
                  <Input
                    placeholder='Get in touch'
                    value={form.watch('contactUs.heading') || ''}
                    onChange={(e) => form.setValue('contactUs.heading', e.target.value)}
                  />
                </div>

                <div>
                  <label className='text-xs text-gray-500 mb-1 block'>Working Hours</label>
                  <Input
                    placeholder='Mon-Fri 10:00 - 18:00'
                    value={form.watch('contactUs.workingHours') || ''}
                    onChange={(e) => form.setValue('contactUs.workingHours', e.target.value)}
                  />
                </div>

                <div>
                  <label className='text-xs text-gray-500 mb-1 block'>Phone</label>
                  <Input
                    placeholder='+91-XXXXXXXXXX'
                    value={form.watch('contactUs.phone') || ''}
                    onChange={(e) => form.setValue('contactUs.phone', e.target.value)}
                  />
                </div>

                <div>
                  <label className='text-xs text-gray-500 mb-1 block'>Email</label>
                  <Input
                    placeholder='support@example.com'
                    value={form.watch('contactUs.email') || ''}
                    onChange={(e) => form.setValue('contactUs.email', e.target.value)}
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='text-xs text-gray-500 mb-1 block'>Map URL (optional)</label>
                  <Input
                    placeholder='https://maps.google.com/...'
                    value={form.watch('contactUs.mapUrl') || ''}
                    onChange={(e) => form.setValue('contactUs.mapUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className='mt-5'>
                <h6 className='font-medium mb-3'>Address</h6>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs text-gray-500 mb-1 block'>Address Line 1</label>
                    <Input
                      placeholder='Street, Building'
                      value={form.watch('contactUs.addressLine1') || ''}
                      onChange={(e) => form.setValue('contactUs.addressLine1', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-500 mb-1 block'>Address Line 2</label>
                    <Input
                      placeholder='Area, Landmark'
                      value={form.watch('contactUs.addressLine2') || ''}
                      onChange={(e) => form.setValue('contactUs.addressLine2', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-500 mb-1 block'>City</label>
                    <Input
                      value={form.watch('contactUs.city') || ''}
                      onChange={(e) => form.setValue('contactUs.city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-500 mb-1 block'>State</label>
                    <Input
                      value={form.watch('contactUs.state') || ''}
                      onChange={(e) => form.setValue('contactUs.state', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-500 mb-1 block'>Pincode</label>
                    <Input
                      value={form.watch('contactUs.pincode') || ''}
                      onChange={(e) => form.setValue('contactUs.pincode', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='text-xs text-gray-500 mb-1 block'>Country</label>
                    <Input
                      value={form.watch('contactUs.country') || ''}
                      onChange={(e) => form.setValue('contactUs.country', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-3 flex-wrap mt-4'>
              <ButtonLoading
                loading={loading}
                type='button'
                text='Save Contact Us Settings'
                className='cursor-pointer'
                onClick={save}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ContactUsPageConfig
