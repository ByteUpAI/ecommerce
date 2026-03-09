'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import slugify from 'slugify'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'
import { z } from 'zod'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
  { href: '', label: 'Add Category' },
]

const AddCategory = () => {
  const [loading, setLoading] = useState(false)
  const formSchema = zSchema.pick({
    name: true, slug: true
  }).extend({
    image: z.string().nullable().optional()
  })

  // media modal states
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: "",
      slug: "",
      image: null,
    },
  })

  useEffect(() => {
    const name = form.getValues('name')
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')])

  useEffect(() => {
    const id = selectedMedia?.[0]?._id || null
    form.setValue('image', id, { shouldValidate: true, shouldDirty: true })
    if (id) {
      form.clearErrors('image')
    }
  }, [selectedMedia])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (!selectedMedia?.[0]?._id) {
        form.setError('image', { message: 'Please select an image.' })
        setLoading(false)
        return
      }

      values.image = selectedMedia[0]._id
      form.clearErrors('image')
      const { data: response } = await axios.post('/api/category/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      form.reset()
      setSelectedMedia([])
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className='text-xl font-semibold'>Add Category</h4>
        </CardHeader>
        <CardContent className="pb-5">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >

              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='md:col-span-2 border border-dashed rounded p-5 text-center'>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input type="hidden" value={field.value || ''} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={false}
                />

                {selectedMedia.length > 0
                  && <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                    {selectedMedia.map(media => (
                      <div key={media._id} className='h-24 w-24 border'>
                        <Image
                          src={media.url}
                          height={100}
                          width={100}
                          alt=''
                          className='size-full object-cover'
                        />
                      </div>
                    ))}
                  </div>
                }

                <div onClick={() => setOpen(true)} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer'>
                  <span className='font-semibold'>Select Image</span>
                </div>
              </div>

              <div className='mb-3'>
                <ButtonLoading loading={loading} type="submit" text="Add Category" className="cursor-pointer" />
              </div>

            </form>
          </Form>

        </CardContent>
      </Card>

    </div>
  )
}

export default AddCategory