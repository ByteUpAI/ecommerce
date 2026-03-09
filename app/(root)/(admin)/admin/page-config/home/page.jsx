'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import MediaModal from '@/components/Application/Admin/MediaModal'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { ADMIN_DASHBOARD, ADMIN_PAGE_CONFIG_HOME } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PAGE_CONFIG_HOME, label: 'Page Config' },
  { href: ADMIN_PAGE_CONFIG_HOME, label: 'Home' },
]

const MIN_BRAND_LOGO_WIDTH = 600
const MIN_BRAND_LOGO_RATIO = 1.4

const getImageDimensions = (url) =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !url) {
      resolve({ width: MIN_BRAND_LOGO_WIDTH, height: MIN_BRAND_LOGO_WIDTH / MIN_BRAND_LOGO_RATIO })
      return
    }

    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error('Unable to load image for validation.'))
    img.src = url
  })

const SortableImageItem = ({ image, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id || index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='relative group'
    >
      <div
        className='absolute top-1 left-1 z-10 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded cursor-move flex items-center gap-1'
        {...attributes}
        {...listeners}
      >
        <GripVertical size={12} />
        {index + 1}
      </div>
      <img
        src={image.secure_url || image.url}
        alt={image.alt || `Slider ${index + 1}`}
        className='w-full h-32 object-cover rounded border'
      />
      <button
        type='button'
        onClick={() => onRemove(index)}
        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10'
      >
        ×
      </button>
    </div>
  )
}

const HomePageConfig = () => {
  const [loadingHome, setLoadingHome] = useState(false)
  const [sliderMediaOpen, setSliderMediaOpen] = useState(false)
  const [sliderSelectedMedia, setSliderSelectedMedia] = useState([])
  const [bannerSectionMediaOpen, setBannerSectionMediaOpen] = useState(false)
  const [bannerSectionSelectedMedia, setBannerSectionSelectedMedia] = useState([])
  const [brandLogoPickerOpen, setBrandLogoPickerOpen] = useState(false)
  const [brandLogoPickerSelectedMedia, setBrandLogoPickerSelectedMedia] = useState([])
  const [brandLogoPickerIndex, setBrandLogoPickerIndex] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const formSchema = z.object({
    hero: z.object({
      accentText: z.string().optional(),
      titleLine1: z.string().optional(),
      titleLine2: z.string().optional(),
      subtitle: z.string().optional(),
      ctaText: z.string().optional(),
      ctaLink: z.string().optional(),
    }).optional(),
    sliderImages: z.array(z.object({
      id: z.string().optional(),
      url: z.string().url().optional(),
      secure_url: z.string().url().optional(),
      public_id: z.string().optional(),
      alt: z.string().optional(),
      link: z.string().url().optional(),
    })).optional(),
    bannerSectionImages: z.array(z.object({
      id: z.string().optional(),
      url: z.string().url().optional(),
      secure_url: z.string().url().optional(),
      public_id: z.string().optional(),
      alt: z.string().optional(),
      link: z.string().url().optional(),
    })).max(2).optional(),
    testimonials: z.array(z.object({
      name: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      content: z.string().optional(),
    })).optional(),
    brandsMarqueeCompanies: z.array(z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      link: z.string().optional(),
      logo: z.object({
        id: z.string().optional(),
        url: z.string().optional(),
        secure_url: z.string().optional(),
        public_id: z.string().optional(),
        alt: z.string().optional(),
      }).optional(),
    })).optional(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      hero: {
        accentText: 'Innovation',
        titleLine1: 'starts',
        titleLine2: 'with a dream and a plan',
        subtitle: 'We offer flexible solutions which help your business to grow',
        ctaText: 'GO TO SHOP',
        ctaLink: '/shop',
      },
      sliderImages: [],
      bannerSectionImages: [],
      testimonials: [],
      brandsMarqueeCompanies: [],
    },
  })

  const { data: homeConfig, error: homeConfigError, refetch: refetchHome } = useFetch('/api/site-config/home')

  useEffect(() => {
    if (homeConfig?.data) {
      form.setValue('hero', homeConfig.data.hero || form.getValues('hero'))
      form.setValue('sliderImages', homeConfig.data.sliderImages || [])
      form.setValue('bannerSectionImages', homeConfig.data.bannerSectionImages || [])
      form.setValue('testimonials', homeConfig.data.testimonials || [])
      form.setValue('brandsMarqueeCompanies', homeConfig.data.brandsMarqueeCompanies || [])
    }
  }, [homeConfig, form])

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const currentImages = form.getValues('sliderImages') || []
    const oldIndex = currentImages.findIndex((item, index) => (item.id || index) === active.id)
    const newIndex = currentImages.findIndex((item, index) => (item.id || index) === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedImages = arrayMove(currentImages, oldIndex, newIndex)
      form.setValue('sliderImages', reorderedImages)
    }
  }

  const saveHome = async () => {
    const values = form.getValues()
    setLoadingHome(true)
    try {
      const { data: res } = await axios.put('/api/site-config/home', {
        hero: values.hero || {},
        sliderImages: values.sliderImages || [],
        bannerSectionImages: values.bannerSectionImages || [],
        testimonials: values.testimonials || [],
        brandsMarqueeCompanies: values.brandsMarqueeCompanies || [],
      })

      if (!res.success) throw new Error(res.message)
      showToast('success', res.message)
      if (typeof refetchHome === 'function') {
        await refetchHome()
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message
      showToast('error', apiMessage || error.message)
    } finally {
      setLoadingHome(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <div className='mt-4'>
        <div className='mb-6'>
          <h4 className='text-2xl font-semibold'>Home Page Settings</h4>
          {homeConfigError ? (
            <div className='mt-2 text-sm text-red-600'>
              {homeConfigError}
            </div>
          ) : null}
        </div>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className='space-y-5'>
            <div className='space-y-4'>
                <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
                  <h5 className='font-medium mb-2'>Hero Content</h5>
                  <p className='text-sm text-gray-600 mb-4'>Update the heading/subtitle and CTA shown on the homepage slider.</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='text-xs text-gray-500 mb-1 block'>Accent Text (Yellow)</label>
                      <Input
                        placeholder='Innovation'
                        value={form.watch('hero')?.accentText || ''}
                        onChange={(e) => form.setValue('hero', { ...(form.getValues('hero') || {}), accentText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className='text-xs text-gray-500 mb-1 block'>Title Line 1</label>
                      <Input
                        placeholder='starts'
                        value={form.watch('hero')?.titleLine1 || ''}
                        onChange={(e) => form.setValue('hero', { ...(form.getValues('hero') || {}), titleLine1: e.target.value })}
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='text-xs text-gray-500 mb-1 block'>Title Line 2</label>
                      <Input
                        placeholder='with a dream and a plan'
                        value={form.watch('hero')?.titleLine2 || ''}
                        onChange={(e) => form.setValue('hero', { ...(form.getValues('hero') || {}), titleLine2: e.target.value })}
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='text-xs text-gray-500 mb-1 block'>Subtitle</label>
                      <Textarea
                        rows={2}
                        placeholder='We offer flexible solutions which help your business to grow'
                        value={form.watch('hero')?.subtitle || ''}
                        onChange={(e) => form.setValue('hero', { ...(form.getValues('hero') || {}), subtitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className='text-xs text-gray-500 mb-1 block'>CTA Text</label>
                      <Input
                        placeholder='GO TO SHOP'
                        value={form.watch('hero')?.ctaText || ''}
                        onChange={(e) => form.setValue('hero', { ...(form.getValues('hero') || {}), ctaText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className='text-xs text-gray-500 mb-1 block'>CTA Link</label>
                      <Input
                        placeholder='/shop'
                        value={form.watch('hero')?.ctaLink || ''}
                        onChange={(e) => form.setValue('hero', { ...(form.getValues('hero') || {}), ctaLink: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
                  <h5 className='font-medium mb-2'>Slider Images (Carousel)</h5>
                  <p className='text-sm text-gray-600 mb-3'>
                    {form.watch('sliderImages')?.length || 0} of 4 images added
                  </p>
                  <p className='text-xs text-gray-500 mb-3'>
                    Drag and drop to reorder images
                  </p>
                  <div className='border rounded-lg p-4'>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={form.watch('sliderImages')?.map((img, index) => img.id || index) || []}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                          {form.watch('sliderImages')?.map((image, index) => (
                            <SortableImageItem
                              key={image.id || index}
                              image={image}
                              index={index}
                              onRemove={(idx) => {
                                const currentImages = form.getValues('sliderImages') || []
                                const newImages = currentImages.filter((_, i) => i !== idx)
                                form.setValue('sliderImages', newImages)
                              }}
                            />
                          ))}
                          {(form.watch('sliderImages')?.length || 0) < 4 && (
                            Array(4 - (form.watch('sliderImages')?.length || 0)).fill(0).map((_, index) => (
                              <div key={`empty-${index}`} className='border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center'>
                                <span className='text-gray-400 text-sm'>Empty slot</span>
                              </div>
                            ))
                          )}
                        </div>
                      </SortableContext>
                    </DndContext>
                    <div
                      onClick={() => {
                        if ((form.watch('sliderImages')?.length || 0) < 4) {
                          setSliderMediaOpen(true)
                          setSliderSelectedMedia([])
                        }
                      }}
                      className={`bg-gray-50 dark:bg-card border w-full mx-auto p-5 cursor-pointer text-center transition-colors ${
                        (form.watch('sliderImages')?.length || 0) >= 4
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className='font-semibold'>
                        {(form.watch('sliderImages')?.length || 0) >= 4
                          ? 'Maximum 4 images reached'
                          : '+ Add Slider Images (Select Multiple)'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
                  <h5 className='font-medium mb-2'>Banner Section (2 Images)</h5>
                  <p className='text-sm text-gray-600 mb-3'>
                    {(form.watch('bannerSectionImages')?.length || 0)} of 2 images added
                  </p>
                  <div className='border rounded-lg p-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                      {form.watch('bannerSectionImages')?.map((image, index) => (
                        <div key={image.id || index} className='relative group'>
                          <img
                            src={image.secure_url || image.url}
                            alt={image.alt || `Banner ${index + 1}`}
                            className='w-full h-32 object-cover rounded border'
                          />
                          <div className='absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
                            {index + 1}
                          </div>
                          <button
                            type='button'
                            onClick={() => {
                              const current = form.getValues('bannerSectionImages') || []
                              const next = current.filter((_, i) => i !== index)
                              form.setValue('bannerSectionImages', next)
                            }}
                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {(form.watch('bannerSectionImages')?.length || 0) < 2 && (
                        Array(2 - (form.watch('bannerSectionImages')?.length || 0)).fill(0).map((_, index) => (
                          <div key={`banner-empty-${index}`} className='border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center'>
                            <span className='text-gray-400 text-sm'>Empty slot</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div
                      onClick={() => {
                        if ((form.watch('bannerSectionImages')?.length || 0) < 2) {
                          setBannerSectionMediaOpen(true)
                          setBannerSectionSelectedMedia([])
                        }
                      }}
                      className={`bg-gray-50 dark:bg-card border w-full mx-auto p-5 cursor-pointer text-center transition-colors ${
                        (form.watch('bannerSectionImages')?.length || 0) >= 2
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className='font-semibold'>
                        {(form.watch('bannerSectionImages')?.length || 0) >= 2
                          ? 'Maximum 2 images reached'
                          : '+ Add Banner Images (Select Multiple)'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
                  <h5 className='font-medium mb-2'>Homepage Testimonials</h5>
                  <p className='text-sm text-gray-600 mb-3'>
                    Add customer testimonials that appear on the homepage
                  </p>
                  <div className='border rounded-lg p-4'>
                    <div className='mb-4 flex justify-end'>
                      <button
                        type='button'
                        onClick={() => {
                          const testimonials = form.getValues('testimonials') || []
                          const hasEmpty = testimonials.some((t) => {
                            const name = (t?.name || '').trim()
                            const content = (t?.content || '').trim()
                            return !name && !content
                          })
                          if (hasEmpty) {
                            showToast('warning', 'Please fill the existing empty testimonial first.')
                            return
                          }
                          form.setValue('testimonials', [{ name: '', rating: 5, content: '' }, ...testimonials])
                        }}
                        className='bg-gray-100 dark:bg-card border rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors text-sm font-medium'
                      >
                        + Add Testimonial
                      </button>
                    </div>
                    <div className='space-y-4 max-h-96 overflow-y-auto'>
                      {form.watch('testimonials')?.map((testimonial, index) => (
                        <div key={index} className='border rounded-lg p-4 bg-gray-50 dark:bg-card'>
                          <div className='flex justify-between items-start mb-3'>
                            <div className='flex-1'>
                              <Input
                                placeholder='Customer Name'
                                value={testimonial.name || ''}
                                onChange={(e) => {
                                  const testimonials = form.getValues('testimonials') || []
                                  testimonials[index] = { ...testimonial, name: e.target.value }
                                  form.setValue('testimonials', testimonials)
                                }}
                                className='mb-2'
                              />
                              <div className='flex items-center gap-2 mb-2'>
                                <span className='text-sm'>Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type='button'
                                    onClick={() => {
                                      const testimonials = form.getValues('testimonials') || []
                                      testimonials[index] = { ...testimonial, rating: star }
                                      form.setValue('testimonials', testimonials)
                                    }}
                                    className='text-2xl'
                                  >
                                    {star <= (testimonial.rating || 0) ? '⭐' : '☆'}
                                  </button>
                                ))}
                              </div>
                              <Textarea
                                placeholder='Customer review text...'
                                value={testimonial.content || ''}
                                onChange={(e) => {
                                  const testimonials = form.getValues('testimonials') || []
                                  testimonials[index] = { ...testimonial, content: e.target.value }
                                  form.setValue('testimonials', testimonials)
                                }}
                                rows={3}
                              />
                            </div>
                            <button
                              type='button'
                              onClick={() => {
                                const testimonials = form.getValues('testimonials') || []
                                const newTestimonials = testimonials.filter((_, i) => i !== index)
                                form.setValue('testimonials', newTestimonials)
                              }}
                              className='ml-2 text-red-500 hover:text-red-700'
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
                  <h5 className='font-medium mb-2'>Brands Marquee</h5>
                  <p className='text-sm text-gray-600 mb-3'>
                    Add companies to show in a continuous scrolling row (logo + name). Hover pauses on the website.
                  </p>
                  <p className='text-xs font-medium text-blue-600 mb-4'>
                    Use landscape logos at least {MIN_BRAND_LOGO_WIDTH}px wide (≈{MIN_BRAND_LOGO_RATIO}:1 ratio) so they cover the marquee tiles without gaps.
                  </p>

                  <div className='border rounded-lg p-4'>
                    <div className='mb-4 flex justify-end'>
                      <button
                        type='button'
                        onClick={() => {
                          const companies = form.getValues('brandsMarqueeCompanies') || []
                          const hasEmpty = companies.some((c) => {
                            const name = (c?.name || '').trim()
                            const desc = (c?.description || '').trim()
                            const link = (c?.link || '').trim()
                            const hasLogo = !!(c?.logo?.secure_url || c?.logo?.url || c?.logo?.id)
                            return !name && !desc && !link && !hasLogo
                          })
                          if (hasEmpty) {
                            showToast('warning', 'Please fill the existing empty company first.')
                            return
                          }
                          form.setValue('brandsMarqueeCompanies', [{ name: '', description: '', link: '', logo: undefined }, ...companies])
                        }}
                        className='bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg px-4 py-2 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 text-sm font-medium text-blue-700 dark:text-blue-300'
                      >
                        + Add New Company
                      </button>
                    </div>
                    <div className='space-y-4 max-h-112 overflow-y-auto'>
                      {(form.watch('brandsMarqueeCompanies') || []).map((company, index) => (
                        <div key={index} className='border rounded-lg p-4 bg-gray-50 dark:bg-card'>
                          <div className='grid md:grid-cols-4 grid-cols-1 gap-4'>
                            <div className='md:col-span-1'>
                              <div className='text-xs text-gray-500 mb-2'>Company Logo</div>
                              <div className='flex flex-col items-center gap-3'>
                                <div className='w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-white dark:bg-background flex items-center justify-center overflow-hidden transition-colors hover:border-gray-400'>
                                  {company?.logo?.secure_url || company?.logo?.url ? (
                                    <img
                                      src={company.logo.secure_url || company.logo.url}
                                      alt={company.logo.alt || company.name || 'Logo'}
                                      className='w-full h-full object-contain p-2'
                                    />
                                  ) : (
                                    <div className='text-center'>
                                      <svg className='mx-auto h-8 w-8 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                      </svg>
                                      <span className='text-xs text-gray-400 mt-1'>No logo</span>
                                    </div>
                                  )}
                                </div>

                                <div className='flex flex-col gap-2 w-full'>
                                  <button
                                    type='button'
                                    className='text-sm border rounded-lg px-3 py-2 bg-white dark:bg-background hover:bg-gray-100 transition-colors'
                                    onClick={() => {
                                      setBrandLogoPickerIndex(index)
                                      setBrandLogoPickerSelectedMedia([])
                                      setBrandLogoPickerOpen(true)
                                    }}
                                  >
                                    {company?.logo?.secure_url || company?.logo?.url ? 'Change Logo' : 'Select Logo'}
                                  </button>

                                  {(company?.logo?.secure_url || company?.logo?.url) ? (
                                    <button
                                      type='button'
                                      className='text-sm text-red-600 hover:text-red-700 transition-colors'
                                      onClick={() => {
                                        const current = form.getValues('brandsMarqueeCompanies') || []
                                        current[index] = { ...current[index], logo: undefined }
                                        form.setValue('brandsMarqueeCompanies', [...current])
                                      }}
                                    >
                                      Remove Logo
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className='md:col-span-3 space-y-3'>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                <div>
                                  <label className='text-xs text-gray-500 mb-1 block'>Company Name</label>
                                  <Input
                                    placeholder='Enter company name'
                                    value={company?.name || ''}
                                    onChange={(e) => {
                                      const current = form.getValues('brandsMarqueeCompanies') || []
                                      current[index] = { ...current[index], name: e.target.value }
                                      form.setValue('brandsMarqueeCompanies', [...current])
                                    }}
                                    className='w-full'
                                  />
                                </div>

                                <div>
                                  <label className='text-xs text-gray-500 mb-1 block'>Website Link</label>
                                  <Input
                                    placeholder='https://example.com (optional)'
                                    value={company?.link || ''}
                                    onChange={(e) => {
                                      const current = form.getValues('brandsMarqueeCompanies') || []
                                      current[index] = { ...current[index], link: e.target.value }
                                      form.setValue('brandsMarqueeCompanies', [...current])
                                    }}
                                    className='w-full'
                                  />
                                </div>
                              </div>

                              <div>
                                <label className='text-xs text-gray-500 mb-1 block'>Description</label>
                                <Textarea
                                  placeholder='Brief company description (shown on hover)'
                                  value={company?.description || ''}
                                  onChange={(e) => {
                                    const current = form.getValues('brandsMarqueeCompanies') || []
                                    current[index] = { ...current[index], description: e.target.value }
                                    form.setValue('brandsMarqueeCompanies', [...current])
                                  }}
                                  rows={2}
                                  className='w-full'
                                />
                              </div>

                              <div className='flex justify-end'>
                                <button
                                  type='button'
                                  className='text-sm text-red-600 hover:text-red-700 transition-colors flex items-center gap-1'
                                  onClick={() => {
                                    const current = form.getValues('brandsMarqueeCompanies') || []
                                    const next = current.filter((_, i) => i !== index)
                                    form.setValue('brandsMarqueeCompanies', next)
                                  }}
                                >
                                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                  </svg>
                                  Delete Company
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='flex gap-3 flex-wrap mt-4'>
                  <ButtonLoading loading={loadingHome} type='button' text='Save Home Settings' className='cursor-pointer' onClick={saveHome} />
                </div>
            </div>
          </form>
        </Form>
      </div>

      <MediaModal
        open={sliderMediaOpen}
        setOpen={setSliderMediaOpen}
        selectedMedia={sliderSelectedMedia}
        setSelectedMedia={(m) => {
          setSliderSelectedMedia(m)
          if (m && m.length > 0) {
            const currentImages = form.getValues('sliderImages') || []
            const availableSlots = 4 - currentImages.length
            const mediaToAdd = m.slice(0, availableSlots)
            const newImages = [...currentImages, ...mediaToAdd.map(media => ({
              id: media._id,
              url: media.url,
              secure_url: media.secure_url,
              public_id: media.public_id,
              alt: media.alt || '',
              link: ''
            }))]
            form.setValue('sliderImages', newImages)
            if (m.length > availableSlots) {
              showToast('warning', `Only ${availableSlots} image(s) were added. Maximum limit is 4 images.`)
            }
          }
          setSliderMediaOpen(false)
          setSliderSelectedMedia([])
        }}
        isMultiple={true}
      />

      <MediaModal
        open={brandLogoPickerOpen}
        setOpen={setBrandLogoPickerOpen}
        selectedMedia={brandLogoPickerSelectedMedia}
        setSelectedMedia={async (m) => {
          setBrandLogoPickerSelectedMedia(m)

          if (brandLogoPickerIndex !== null && m && m.length > 0) {
            const selected = m[0]

            try {
              const dimensions = await getImageDimensions(selected.secure_url || selected.url)
              const ratio = dimensions.width / dimensions.height

              if (dimensions.width < MIN_BRAND_LOGO_WIDTH || ratio < MIN_BRAND_LOGO_RATIO) {
                showToast(
                  'warning',
                  `Logo must be at least ${MIN_BRAND_LOGO_WIDTH}px wide with ~${MIN_BRAND_LOGO_RATIO}:1 landscape ratio.`
                )
                return
              }
            } catch (error) {
              showToast('error', error.message || 'Unable to validate image dimensions.')
              return
            }

            const current = form.getValues('brandsMarqueeCompanies') || []
            if (current[brandLogoPickerIndex]) {
              current[brandLogoPickerIndex] = {
                ...current[brandLogoPickerIndex],
                logo: {
                  id: selected._id,
                  url: selected.url,
                  secure_url: selected.secure_url,
                  public_id: selected.public_id,
                  alt: selected.alt || '',
                },
              }
              form.setValue('brandsMarqueeCompanies', [...current])
            }
          }

          setBrandLogoPickerOpen(false)
          setBrandLogoPickerSelectedMedia([])
          setBrandLogoPickerIndex(null)
        }}
        isMultiple={false}
      />

      <MediaModal
        open={bannerSectionMediaOpen}
        setOpen={setBannerSectionMediaOpen}
        selectedMedia={bannerSectionSelectedMedia}
        setSelectedMedia={(m) => {
          setBannerSectionSelectedMedia(m)

          if (m && m.length > 0) {
            const currentImages = form.getValues('bannerSectionImages') || []
            const availableSlots = 2 - currentImages.length
            const mediaToAdd = m.slice(0, availableSlots)

            const newImages = [...currentImages, ...mediaToAdd.map(media => ({
              id: media._id,
              url: media.url,
              secure_url: media.secure_url,
              public_id: media.public_id,
              alt: media.alt || '',
              link: ''
            }))]

            form.setValue('bannerSectionImages', newImages)

            if (m.length > availableSlots) {
              showToast('warning', `Only ${availableSlots} image(s) were added. Maximum limit is 2 images.`)
            }
          }

          setBannerSectionMediaOpen(false)
          setBannerSectionSelectedMedia([])
        }}
        isMultiple={true}
      />
    </div>
  )
}

export default HomePageConfig
