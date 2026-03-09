'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import MediaModal from '@/components/Application/Admin/MediaModal'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { ADMIN_DASHBOARD, ADMIN_SITE_CONFIGURATION } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_SITE_CONFIGURATION, label: 'Site Configuration' },
]

const SiteConfiguration = () => {
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [loadingInvoice, setLoadingInvoice] = useState(false)
  const [loadingBank, setLoadingBank] = useState(false)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [loadingGeneral, setLoadingGeneral] = useState(false)
  const [invoiceMediaOpen, setInvoiceMediaOpen] = useState(false)
  const [invoiceSelectedMedia, setInvoiceSelectedMedia] = useState([])
  const [shippingMediaOpen, setShippingMediaOpen] = useState(false)
  const [shippingSelectedMedia, setShippingSelectedMedia] = useState([])
  const [baseline, setBaseline] = useState(null)

  const emailOrEmpty = z.union([z.string().email('Invalid email.'), z.literal('')])
  const phoneOrEmpty = z.union([
    z.string().regex(/^\d{10,15}$/, 'Phone must be 10 to 15 digits.'),
    z.literal('')
  ])
  const gstinOrEmpty = z.union([
    z.string().regex(/^[0-9A-Z]{15}$/, 'GSTIN must be 15 characters.'),
    z.literal('')
  ])
  const pincodeOrEmpty = z.union([
    z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits.'),
    z.literal('')
  ])
  const accountNumberOrEmpty = z.union([
    z.string().regex(/^\d{9,18}$/, 'Account number must be 9 to 18 digits.'),
    z.literal('')
  ])
  const ifscOrEmpty = z.union([
    z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC.'),
    z.literal('')
  ])
  const upiOrEmpty = z.union([
    z.string().regex(/^[\w.\-]{2,256}@[\w]{2,64}$/, 'Invalid UPI ID.'),
    z.literal('')
  ])
  const objectIdOrNull = z.union([
    z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid media id.'),
    z.null(),
  ])

  const formSchema = z.object({
    contactNotificationEmailsText: z.string().optional(),
    orderNotificationEmailsText: z.string().optional(),
    sendContactCopyToUser: z.boolean().optional(),
    invoiceCompanyName: z.string().trim().optional(),
    invoiceCompanyEmail: emailOrEmpty.optional(),
    invoiceCompanyPhone: phoneOrEmpty.optional(),
    invoiceCompanyGstin: gstinOrEmpty.optional(),
    invoiceCompanyAddressLine1: z.string().trim().optional(),
    invoiceCompanyAddressLine2: z.string().trim().optional(),
    invoiceCompanyCity: z.string().trim().optional(),
    invoiceCompanyState: z.string().trim().optional(),
    invoiceCompanyPincode: pincodeOrEmpty.optional(),
    invoiceCompanyCountry: z.string().trim().optional(),
    bankAccountName: z.string().trim().optional(),
    bankAccountNumber: accountNumberOrEmpty.optional(),
    bankBankName: z.string().trim().optional(),
    bankIfsc: ifscOrEmpty.optional(),
    bankBranch: z.string().trim().optional(),
    bankUpiId: upiOrEmpty.optional(),
    invoiceTerms: z.string().optional(),
    invoiceFooterNote: z.string().optional(),
    invoiceTemplateMedia: objectIdOrNull.optional(),
    shippingLabelTemplateMedia: objectIdOrNull.optional(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      contactNotificationEmailsText: '',
      orderNotificationEmailsText: '',
      sendContactCopyToUser: false,
      invoiceCompanyName: '',
      invoiceCompanyEmail: '',
      invoiceCompanyPhone: '',
      invoiceCompanyGstin: '',
      invoiceCompanyAddressLine1: '',
      invoiceCompanyAddressLine2: '',
      invoiceCompanyCity: '',
      invoiceCompanyState: '',
      invoiceCompanyPincode: '',
      invoiceCompanyCountry: '',
      bankAccountName: '',
      bankAccountNumber: '',
      bankBankName: '',
      bankIfsc: '',
      bankBranch: '',
      bankUpiId: '',
      invoiceTerms: '',
      invoiceFooterNote: '',
      invoiceTemplateMedia: null,
      shippingLabelTemplateMedia: null,
    },
  })

  const { data, error: configError, refetch } = useFetch('/api/site-config')

  const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
    const apiMessage = error?.response?.data?.message
    const issues = error?.response?.data?.data?.issues
    const issueMessage = Array.isArray(issues) && issues.length ? issues[0]?.message : null
    return issueMessage || apiMessage || error?.message || fallback
  }

  const invoicePathToFormField = {
    'invoiceCompany.name': 'invoiceCompanyName',
    'invoiceCompany.email': 'invoiceCompanyEmail',
    'invoiceCompany.phone': 'invoiceCompanyPhone',
    'invoiceCompany.gstin': 'invoiceCompanyGstin',
    'invoiceCompany.addressLine1': 'invoiceCompanyAddressLine1',
    'invoiceCompany.addressLine2': 'invoiceCompanyAddressLine2',
    'invoiceCompany.city': 'invoiceCompanyCity',
    'invoiceCompany.state': 'invoiceCompanyState',
    'invoiceCompany.pincode': 'invoiceCompanyPincode',
    'invoiceCompany.country': 'invoiceCompanyCountry',
    invoiceTerms: 'invoiceTerms',
    invoiceFooterNote: 'invoiceFooterNote',
    invoiceTemplateMedia: 'invoiceTemplateMedia',
  }

  const applyInvoiceFieldErrors = (issues = []) => {
    // Clear previous invoice-related errors
    Object.values(invoicePathToFormField).forEach(fieldName => {
      form.clearErrors(fieldName)
    })

    issues.forEach((issue) => {
      const path = Array.isArray(issue?.path) ? issue.path.join('.') : ''
      const fieldName = path && invoicePathToFormField[path]
      if (fieldName) {
        form.setError(fieldName, { message: issue?.message || 'Invalid value.' })
      }
    })
  }

  useEffect(() => {
    if (data?.success && data.data) {
      const config = data.data
      setBaseline(config)
      applyBaselineToForm(config)
    }
  }, [data])

  const parseEmails = (value) => {
    return (value || '')
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter(Boolean)
  }

  const applyBaselineToForm = (config) => {
    if (!config) return

    const emails = (config?.contactNotificationEmails || []).join('\n')
    const orderEmails = (config?.orderNotificationEmails || []).join('\n')

    form.reset({
      contactNotificationEmailsText: emails,
      orderNotificationEmailsText: orderEmails,
      sendContactCopyToUser: !!config?.sendContactCopyToUser,
      invoiceCompanyName: config?.invoiceCompany?.name || '',
      invoiceCompanyEmail: config?.invoiceCompany?.email || '',
      invoiceCompanyPhone: config?.invoiceCompany?.phone || '',
      invoiceCompanyGstin: config?.invoiceCompany?.gstin || '',
      invoiceCompanyAddressLine1: config?.invoiceCompany?.addressLine1 || '',
      invoiceCompanyAddressLine2: config?.invoiceCompany?.addressLine2 || '',
      invoiceCompanyCity: config?.invoiceCompany?.city || '',
      invoiceCompanyState: config?.invoiceCompany?.state || '',
      invoiceCompanyPincode: config?.invoiceCompany?.pincode || '',
      invoiceCompanyCountry: config?.invoiceCompany?.country || '',
      bankAccountName: config?.bankDetails?.accountName || '',
      bankAccountNumber: config?.bankDetails?.accountNumber || '',
      bankBankName: config?.bankDetails?.bankName || '',
      bankIfsc: config?.bankDetails?.ifsc || '',
      bankBranch: config?.bankDetails?.branch || '',
      bankUpiId: config?.bankDetails?.upiId || '',
      invoiceTerms: config?.invoiceTerms || '',
      invoiceFooterNote: config?.invoiceFooterNote || '',
      invoiceTemplateMedia: config?.invoiceTemplateMedia?._id || null,
      shippingLabelTemplateMedia: config?.shippingLabelTemplateMedia?._id || null,
    })

    if (config?.invoiceTemplateMedia?._id) {
      setInvoiceSelectedMedia([{ _id: config.invoiceTemplateMedia._id, url: config.invoiceTemplateMedia.secure_url }])
    } else {
      setInvoiceSelectedMedia([])
    }

    if (config?.shippingLabelTemplateMedia?._id) {
      setShippingSelectedMedia([{ _id: config.shippingLabelTemplateMedia._id, url: config.shippingLabelTemplateMedia.secure_url }])
    } else {
      setShippingSelectedMedia([])
    }
  }

  const cancelNotifications = () => {
    if (!baseline) return
    form.setValue('contactNotificationEmailsText', (baseline?.contactNotificationEmails || []).join('\n'))
    form.setValue('orderNotificationEmailsText', (baseline?.orderNotificationEmails || []).join('\n'))
  }

  const cancelInvoice = () => {
    if (!baseline) return
    form.setValue('invoiceCompanyName', baseline?.invoiceCompany?.name || '')
    form.setValue('invoiceCompanyEmail', baseline?.invoiceCompany?.email || '')
    form.setValue('invoiceCompanyPhone', baseline?.invoiceCompany?.phone || '')
    form.setValue('invoiceCompanyGstin', baseline?.invoiceCompany?.gstin || '')
    form.setValue('invoiceCompanyAddressLine1', baseline?.invoiceCompany?.addressLine1 || '')
    form.setValue('invoiceCompanyAddressLine2', baseline?.invoiceCompany?.addressLine2 || '')
    form.setValue('invoiceCompanyCity', baseline?.invoiceCompany?.city || '')
    form.setValue('invoiceCompanyState', baseline?.invoiceCompany?.state || '')
    form.setValue('invoiceCompanyPincode', baseline?.invoiceCompany?.pincode || '')
    form.setValue('invoiceCompanyCountry', baseline?.invoiceCompany?.country || '')
    form.setValue('invoiceTerms', baseline?.invoiceTerms || '')
    form.setValue('invoiceFooterNote', baseline?.invoiceFooterNote || '')
    form.setValue('invoiceTemplateMedia', baseline?.invoiceTemplateMedia?._id || null)

    if (baseline?.invoiceTemplateMedia?._id) {
      setInvoiceSelectedMedia([{ _id: baseline.invoiceTemplateMedia._id, url: baseline.invoiceTemplateMedia.secure_url }])
    } else {
      setInvoiceSelectedMedia([])
    }
  }

  const cancelBank = () => {
    if (!baseline) return
    form.setValue('bankAccountName', baseline?.bankDetails?.accountName || '')
    form.setValue('bankAccountNumber', baseline?.bankDetails?.accountNumber || '')
    form.setValue('bankBankName', baseline?.bankDetails?.bankName || '')
    form.setValue('bankIfsc', baseline?.bankDetails?.ifsc || '')
    form.setValue('bankBranch', baseline?.bankDetails?.branch || '')
    form.setValue('bankUpiId', baseline?.bankDetails?.upiId || '')
  }

  const cancelShipping = () => {
    if (!baseline) return
    form.setValue('shippingLabelTemplateMedia', baseline?.shippingLabelTemplateMedia?._id || null)
    if (baseline?.shippingLabelTemplateMedia?._id) {
      setShippingSelectedMedia([{ _id: baseline.shippingLabelTemplateMedia._id, url: baseline.shippingLabelTemplateMedia.secure_url }])
    } else {
      setShippingSelectedMedia([])
    }
  }

  const cancelGeneral = () => {
    if (!baseline) return
    form.setValue('sendContactCopyToUser', !!baseline?.sendContactCopyToUser)
  }

  const saveNotifications = async () => {
    const values = form.getValues()
    setLoadingNotifications(true)
    try {
      const contactEmails = parseEmails(values.contactNotificationEmailsText)
      const orderEmails = parseEmails(values.orderNotificationEmailsText)

      const invalidContact = contactEmails.filter((e) => !z.string().email().safeParse(e).success)
      const invalidOrder = orderEmails.filter((e) => !z.string().email().safeParse(e).success)

      if (invalidContact.length) {
        form.setError('contactNotificationEmailsText', { message: `Invalid emails: ${invalidContact.join(', ')}` })
        throw new Error('Please fix invalid contact notification emails.')
      }
      if (invalidOrder.length) {
        form.setError('orderNotificationEmailsText', { message: `Invalid emails: ${invalidOrder.join(', ')}` })
        throw new Error('Please fix invalid order notification emails.')
      }

      form.clearErrors(['contactNotificationEmailsText', 'orderNotificationEmailsText'])

      const { data: res } = await axios.put('/api/site-config/notifications', {
        contactNotificationEmails: contactEmails,
        orderNotificationEmails: orderEmails,
      })

      if (!res.success) throw new Error(res.message)
      showToast('success', res.message)
      await refetch()
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      showToast('error', apiMessage || error.message)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const saveInvoice = async () => {
    const values = form.getValues()
    setLoadingInvoice(true)
    try {
      if (values.invoiceTemplateMedia && !/^[a-fA-F0-9]{24}$/.test(String(values.invoiceTemplateMedia))) {
        form.setError('invoiceTemplateMedia', { message: 'Invalid media id.' })
        throw new Error('Please re-select invoice logo/template.')
      }
      form.clearErrors(['invoiceTemplateMedia'])

      const { data: res } = await axios.put('/api/site-config/invoice', {
        invoiceCompany: {
          name: values.invoiceCompanyName || '',
          email: values.invoiceCompanyEmail || '',
          phone: values.invoiceCompanyPhone || '',
          gstin: values.invoiceCompanyGstin || '',
          addressLine1: values.invoiceCompanyAddressLine1 || '',
          addressLine2: values.invoiceCompanyAddressLine2 || '',
          city: values.invoiceCompanyCity || '',
          state: values.invoiceCompanyState || '',
          pincode: values.invoiceCompanyPincode || '',
          country: values.invoiceCompanyCountry || '',
        },
        invoiceTerms: values.invoiceTerms || '',
        invoiceFooterNote: values.invoiceFooterNote || '',
        invoiceTemplateMedia: values.invoiceTemplateMedia || null,
      })

      if (!res.success) throw new Error(res.message)
      showToast('success', res.message)
      await refetch()
    } catch (error) {
      const issues = error?.response?.data?.data?.issues
      console.log('Invoice save error:', { error, issues })
      if (Array.isArray(issues) && issues.length) {
        applyInvoiceFieldErrors(issues)
      }
      showToast('error', getApiErrorMessage(error, 'Failed to save invoice settings.'))
    } finally {
      setLoadingInvoice(false)
    }
  }

  const saveBank = async () => {
    const values = form.getValues()
    setLoadingBank(true)
    try {
      const { data: res } = await axios.put('/api/site-config/bank', {
        bankDetails: {
          accountName: values.bankAccountName || '',
          accountNumber: values.bankAccountNumber || '',
          bankName: values.bankBankName || '',
          ifsc: values.bankIfsc || '',
          branch: values.bankBranch || '',
          upiId: values.bankUpiId || '',
        },
      })

      if (!res.success) throw new Error(res.message)
      showToast('success', res.message)
      await refetch()
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      showToast('error', apiMessage || error.message)
    } finally {
      setLoadingBank(false)
    }
  }

  const saveShipping = async () => {
    const values = form.getValues()
    setLoadingShipping(true)
    try {
      if (values.shippingLabelTemplateMedia && !/^[a-fA-F0-9]{24}$/.test(String(values.shippingLabelTemplateMedia))) {
        form.setError('shippingLabelTemplateMedia', { message: 'Invalid media id.' })
        throw new Error('Please re-select shipping logo/template.')
      }
      form.clearErrors(['shippingLabelTemplateMedia'])

      const { data: res } = await axios.put('/api/site-config/shipping', {
        shippingLabelTemplateMedia: values.shippingLabelTemplateMedia || null,
      })

      if (!res.success) throw new Error(res.message)
      showToast('success', res.message)
      await refetch()
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      showToast('error', apiMessage || error.message)
    } finally {
      setLoadingShipping(false)
    }
  }

  const saveGeneral = async () => {
    const values = form.getValues()
    setLoadingGeneral(true)
    try {
      const { data: res } = await axios.put('/api/site-config/general', {
        sendContactCopyToUser: !!values.sendContactCopyToUser,
      })

      if (!res.success) throw new Error(res.message)
      showToast('success', res.message)
      await refetch()
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      showToast('error', apiMessage || error.message)
    } finally {
      setLoadingGeneral(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className='text-xl font-semibold'>Site Configuration</h4>
        </CardHeader>
        <CardContent className="pb-5">
          {configError ? (
            <div className='mb-4 text-sm text-red-600'>
              {configError}
            </div>
          ) : null}
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-5'>
              <div>
                <FormField
                  control={form.control}
                  name="contactNotificationEmailsText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Notification Emails</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter email addresses (one per line or comma separated)"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="orderNotificationEmailsText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notification Emails</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter email addresses (one per line or comma separated)"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex gap-3 flex-wrap'>
                <ButtonLoading loading={loadingNotifications} type="button" text="Save Notifications" className="cursor-pointer" onClick={saveNotifications} />
                <ButtonLoading loading={false} type="button" text="Cancel" className="cursor-pointer" onClick={cancelNotifications} />
              </div>

              <div className='border-t pt-5'>
                <h4 className='text-lg font-semibold mb-3'>Invoice Settings</h4>

                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                  <FormField control={form.control} name="invoiceCompanyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl><Input placeholder="Company name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyGstin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl><Input placeholder="GSTIN" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email</FormLabel>
                      <FormControl><Input placeholder="Company email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone</FormLabel>
                      <FormControl><Input placeholder="Company phone" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyAddressLine1" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl><Input placeholder="Address line 1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyAddressLine2" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl><Input placeholder="Address line 2" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyCity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="City" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyState" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input placeholder="State" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyPincode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl><Input placeholder="Pincode" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="invoiceCompanyCountry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="Country" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className='mt-5 border border-dashed rounded p-5 text-center'>
                  <MediaModal
                    open={invoiceMediaOpen}
                    setOpen={setInvoiceMediaOpen}
                    selectedMedia={invoiceSelectedMedia}
                    setSelectedMedia={(m) => {
                      setInvoiceSelectedMedia(m)
                      form.setValue('invoiceTemplateMedia', m?.[0]?._id || null)
                    }}
                    isMultiple={false}
                  />

                  {invoiceSelectedMedia.length > 0 && (
                    <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                      {invoiceSelectedMedia.map(media => (
                        <div key={media._id} className='h-20 w-40 border'>
                          {/\.pdf(\?|#|$)/i.test(String(media?.url || '')) ? (
                            <a className='w-full h-full flex items-center justify-center text-sm underline' href={media.url} target='_blank' rel='noreferrer'>PDF</a>
                          ) : (
                            <Image src={media.url} height={80} width={160} alt='' className='size-full object-contain' />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div onClick={() => setInvoiceMediaOpen(true)} className='bg-gray-50 dark:bg-card border w-[240px] mx-auto p-5 cursor-pointer'>
                    <span className='font-semibold'>Select Invoice Logo/Template</span>
                  </div>

                  <div className='mt-4 flex justify-center gap-4 flex-wrap text-sm'>
                    <a className='underline' href='/api/site-config/invoice-preview' target='_blank' rel='noreferrer'>Invoice Preview (PDF)</a>
                  </div>
                </div>

                <div className='mt-6 border-t pt-5'>
                  <h4 className='text-base font-semibold mb-3'>Invoice Notes</h4>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <FormField
                      control={form.control}
                      name="invoiceTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms</FormLabel>
                          <FormControl>
                            <Textarea rows={6} placeholder="Payment terms, return policy, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="invoiceFooterNote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Footer Note</FormLabel>
                          <FormControl>
                            <Textarea rows={6} placeholder="Thank you note / disclaimer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='mt-4 flex gap-3 flex-wrap'>
                  <ButtonLoading loading={loadingInvoice} type="button" text="Save Invoice & Notes" className="cursor-pointer" onClick={saveInvoice} />
                  <ButtonLoading loading={false} type="button" text="Cancel" className="cursor-pointer" onClick={cancelInvoice} />
                </div>

                <div className='mt-6 border-t pt-5'>
                  <h4 className='text-base font-semibold mb-3'>Bank Details (Payment)</h4>
                  <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <FormField control={form.control} name="bankAccountName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl><Input placeholder="Account name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl><Input placeholder="Account number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="bankBankName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl><Input placeholder="Bank name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="bankIfsc" render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC</FormLabel>
                        <FormControl><Input placeholder="IFSC" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="bankBranch" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <FormControl><Input placeholder="Branch" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="bankUpiId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID</FormLabel>
                        <FormControl><Input placeholder="UPI ID" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className='mt-4 flex gap-3 flex-wrap'>
                  <ButtonLoading loading={loadingBank} type="button" text="Save Bank Details" className="cursor-pointer" onClick={saveBank} />
                  <ButtonLoading loading={false} type="button" text="Cancel" className="cursor-pointer" onClick={cancelBank} />
                </div>

                <div className='mt-6 border-t pt-5'>
                  <h4 className='text-base font-semibold mb-3'>Shipping Label Settings</h4>

                  <div className='border border-dashed rounded p-5 text-center'>
                    <MediaModal
                      open={shippingMediaOpen}
                      setOpen={setShippingMediaOpen}
                      selectedMedia={shippingSelectedMedia}
                      setSelectedMedia={(m) => {
                        setShippingSelectedMedia(m)
                        form.setValue('shippingLabelTemplateMedia', m?.[0]?._id || null)
                      }}
                      isMultiple={false}
                    />

                    {shippingSelectedMedia.length > 0 && (
                      <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                        {shippingSelectedMedia.map(media => (
                          <div key={media._id} className='h-20 w-40 border'>
                            {/\.pdf(\?|#|$)/i.test(String(media?.url || '')) ? (
                              <a className='w-full h-full flex items-center justify-center text-sm underline' href={media.url} target='_blank' rel='noreferrer'>PDF</a>
                            ) : (
                              <Image src={media.url} height={80} width={160} alt='' className='size-full object-contain' />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div onClick={() => setShippingMediaOpen(true)} className='bg-gray-50 dark:bg-card border w-[240px] mx-auto p-5 cursor-pointer'>
                      <span className='font-semibold'>Select Shipping Logo/Template</span>
                    </div>

                    <div className='mt-4 flex justify-center gap-4 flex-wrap text-sm'>
                      <a className='underline' href='/api/site-config/shipping-label-preview' target='_blank' rel='noreferrer'>Shipping Label Preview (PDF)</a>
                    </div>
                  </div>
                </div>

                <div className='mt-4 flex gap-3 flex-wrap'>
                  <ButtonLoading loading={loadingShipping} type="button" text="Save Shipping" className="cursor-pointer" onClick={saveShipping} />
                  <ButtonLoading loading={false} type="button" text="Cancel" className="cursor-pointer" onClick={cancelShipping} />
                </div>
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="sendContactCopyToUser"
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-3 space-y-0'>
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className='m-0'>Send a copy of the contact query to the user</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex gap-3 flex-wrap'>
                <ButtonLoading loading={loadingGeneral} type="button" text="Save General" className="cursor-pointer" onClick={saveGeneral} />
                <ButtonLoading loading={false} type="button" text="Cancel" className="cursor-pointer" onClick={cancelGeneral} />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SiteConfiguration
