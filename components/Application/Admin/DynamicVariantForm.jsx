'use client'
import { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Select from '@/components/Application/Select'
import ButtonLoading from '@/components/Application/ButtonLoading'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const DynamicVariantForm = ({ form, onSubmit, loading, productOption, selectedProductId, initialMedia = [], submitText = 'Save Product Variant' }) => {
    const [selectedMedia, setSelectedMedia] = useState([])
    const [open, setOpen] = useState(false)
    const [productConfig, setProductConfig] = useState(null)
    const [loadingConfig, setLoadingConfig] = useState(false)

    useEffect(() => {
        if (Array.isArray(initialMedia) && initialMedia.length > 0) {
            setSelectedMedia(initialMedia)
        }
    }, [initialMedia])

    useEffect(() => {
        const ids = Array.isArray(selectedMedia) ? selectedMedia.map((m) => m?._id).filter(Boolean) : []
        form.setValue('media', ids, { shouldValidate: true, shouldDirty: true })
        if (ids.length) {
            form.clearErrors('media')
        }
    }, [selectedMedia])

    // Fetch product config when product is selected
    useEffect(() => {
        if (selectedProductId) {
            fetchProductConfig(selectedProductId)
        } else {
            setProductConfig(null)
        }
    }, [selectedProductId])

    const fetchProductConfig = async (productId) => {
        setLoadingConfig(true)
        try {
            const { data } = await axios.get(`/api/product/get/${productId}`)
            if (data.success) {
                setProductConfig(data.data)
            }
        } catch (error) {
            showToast('error', 'Failed to load product configuration')
        } finally {
            setLoadingConfig(false)
        }
    }

    // Auto-calculate discount percentage
    useEffect(() => {
        const mrp = form.getValues('mrp') || 0
        const sellingPrice = form.getValues('sellingPrice') || 0

        if (mrp > 0 && sellingPrice > 0) {
            const discountPercentage = ((mrp - sellingPrice) / mrp) * 100
            form.setValue('discountPercentage', Math.round(discountPercentage))
        }
    }, [form.watch('mrp'), form.watch('sellingPrice')])

    const handleSubmit = async (values) => {
        if (selectedMedia.length <= 0) {
            form.setError('media', { message: 'Please select media.' })
            return
        }

        // Collect dynamic attributes
        const attributes = {}
        if (productConfig?.variantConfig?.attributes) {
            productConfig.variantConfig.attributes.forEach(attr => {
                const isRequired = attr?.required !== false
                const value = values[`attr_${attr.key}`]
                if (isRequired && (value === undefined || value === null || String(value).trim() === '')) {
                    form.setError(`attr_${attr.key}`, { message: `${attr.label} is required` })
                }
                if (value !== undefined && value !== null && String(value).trim() !== '') {
                    attributes[attr.key] = value
                }
            })
        }

        if (Object.keys(form.formState.errors || {}).length) {
            return
        }

        const mediaIds = selectedMedia.map(media => media._id)
        form.clearErrors('media')
        const payload = {
            _id: values._id,
            product: values.product,
            name: values.name,
            barcode: values.barcode,
            sku: values.sku,
            mrp: values.mrp,
            sellingPrice: values.sellingPrice,
            discountPercentage: values.discountPercentage,
            stock: values.stock || 0,
            attributes,
            media: mediaIds
        }

        try {
            await onSubmit(payload)
        } catch (err) {
            showToast('error', err?.message || 'Failed to save variant')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                    
                    {/* Product Selection */}
                    <div className='md:col-span-2'>
                        <FormField
                            control={form.control}
                            name="product"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Select
                                            options={productOption}
                                            selected={field.value}
                                            setSelected={field.onChange}
                                            isMulti={false}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Dynamic Attribute Fields */}
                    {loadingConfig && (
                        <div className='md:col-span-2 text-center py-4'>
                            <p>Loading product configuration...</p>
                        </div>
                    )}

                    {!loadingConfig && productConfig && productConfig.variantConfig?.attributes && (
                        <>
                            {productConfig.variantConfig.attributes.map((attr) => (
                                <div key={attr.key}>
                                    <FormField
                                        control={form.control}
                                        name={`attr_${attr.key}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {attr.label} 
                                                    {attr.unit && <span className='text-sm text-gray-500'> ({attr.unit})</span>}
                                                    {attr?.required !== false && <span className='text-red-500'> *</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    {attr.options && attr.options.length > 0 ? (
                                                        <Select
                                                            options={attr.options.map(opt => ({ label: opt, value: opt }))}
                                                            selected={field.value}
                                                            setSelected={field.onChange}
                                                            isMulti={false}
                                                        />
                                                    ) : (
                                                        <Input 
                                                            type={attr.type === 'number' ? 'number' : 'text'} 
                                                            placeholder={`Enter ${attr.label.toLowerCase()}`} 
                                                            {...field} 
                                                        />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {!selectedProductId && (
                        <div className='md:col-span-2 text-center py-4 text-gray-500'>
                            Please select a product to configure variant attributes
                        </div>
                    )}

                    {/* Variant Name */}
                    <div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Optional name for admin" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Variant Barcode */}
                    <div>
                        <FormField
                            control={form.control}
                            name="barcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Barcode</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Scan or enter barcode" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* SKU */}
                    <div>
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Enter SKU" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter stock quantity" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* MRP */}
                    <div>
                        <FormField
                            control={form.control}
                            name="mrp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>MRP <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter MRP" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Selling Price */}
                    <div>
                        <FormField
                            control={form.control}
                            name="sellingPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Selling Price <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter Selling Price" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Discount Percentage */}
                    <div>
                        <FormField
                            control={form.control}
                            name="discountPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount % <span className='text-red-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" readOnly placeholder="Auto-calculated" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Media Selection */}
                <div className='mt-5 border border-dashed rounded p-5 text-center'>
                    <FormField
                        control={form.control}
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <input type="hidden" value={(field.value || []).join(',')} readOnly />
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
                        isMultiple={true}
                    />

                    {selectedMedia.length > 0 && (
                        <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
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
                    )}

                    <div onClick={() => setOpen(true)} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer'>
                        <span className='font-semibold'>Select Media</span>
                    </div>
                </div>

                <div className='mt-5'>
                    <ButtonLoading 
                        loading={loading} 
                        type="submit" 
                        text={submitText} 
                        className="cursor-pointer" 
                    />
                </div>
            </form>
        </Form>
    )
}

export default DynamicVariantForm
