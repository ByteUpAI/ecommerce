'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Form } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { ADMIN_DASHBOARD, ADMIN_PAGE_CONFIG_TERMS } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import { marked } from 'marked'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PAGE_CONFIG_TERMS, label: 'Page Config' },
  { href: ADMIN_PAGE_CONFIG_TERMS, label: 'Terms & Conditions' },
]

const TermsAndConditionsPageConfig = () => {
  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    termsAndConditions: z.object({
      markdown: z.string().optional(),
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      termsAndConditions: {
        markdown: '',
      },
    },
  })

  const { data, error, refetch } = useFetch('/api/site-config/terms-and-conditions')

  useEffect(() => {
    if (data?.data?.termsAndConditions?.markdown !== undefined) {
      form.setValue('termsAndConditions.markdown', data.data.termsAndConditions.markdown || '')
    }
  }, [data, form])

  const previewHtml = useMemo(() => {
    const md = form.watch('termsAndConditions.markdown') || ''
    try {
      return marked.parse(md)
    } catch (e) {
      return ''
    }
  }, [form.watch('termsAndConditions.markdown')])

  const save = async () => {
    const values = form.getValues()
    setLoading(true)
    try {
      const { data: res } = await axios.put('/api/site-config/terms-and-conditions', values)
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
          <h4 className='text-2xl font-semibold'>Terms & Conditions Settings</h4>
          {error ? (
            <div className='mt-2 text-sm text-red-600'>
              {error}
            </div>
          ) : null}
        </div>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className='space-y-5'>
            <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
              <h5 className='font-medium mb-2'>Markdown Content</h5>
              <p className='text-xs text-gray-500 mb-4'>Write terms using Markdown. This will render on the website.</p>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <div>
                  <label className='text-xs text-gray-500 mb-1 block'>Markdown</label>
                  <Textarea
                    value={form.watch('termsAndConditions.markdown') || ''}
                    onChange={(e) => form.setValue('termsAndConditions.markdown', e.target.value)}
                    rows={22}
                    className='font-mono'
                    placeholder={'# Terms & Conditions\n\nWrite your terms here...'}
                  />
                </div>

                <div>
                  <label className='text-xs text-gray-500 mb-1 block'>Preview</label>
                  <div className='prose max-w-none border rounded-lg p-4 min-h-[420px] overflow-auto bg-gray-50'
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            </div>

            <div className='flex gap-3 flex-wrap mt-4'>
              <ButtonLoading
                loading={loading}
                type='button'
                text='Save Terms & Conditions'
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

export default TermsAndConditionsPageConfig
