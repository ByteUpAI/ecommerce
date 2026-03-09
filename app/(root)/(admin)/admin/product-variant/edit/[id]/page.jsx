'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { use, useEffect, useState } from 'react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import DynamicVariantForm from '@/components/Application/Admin/DynamicVariantForm'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
  { href: '', label: 'Edit Product Variant' },
]

const EditProductVariant = ({ params }) => {

  const { id } = use(params)

  const [loading, setLoading] = useState(false)
  const [productOption, setProductOption] = useState([])
  const [initialMedia, setInitialMedia] = useState([])
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&&size=10000')
  const { data: getVariant, loading: getVariantLoading } = useFetch(`/api/product-variant/get/${id}`)

  const form = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      _id: id,
      product: "",
      name: "",
      barcode: "",
      sku: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
      stock: 0,
    },
  })

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data
      const options = data.map((product) => ({ label: product.name, value: product._id }))
      setProductOption(options)
    }
  }, [getProduct])

  useEffect(() => {
    if (getVariant && getVariant.success) {
      const variant = getVariant.data

      form.reset({
        _id: variant?._id,
        product: variant?.product,
        name: variant?.name || '',
        barcode: variant?.barcode || '',
        sku: variant?.sku || '',
        mrp: variant?.mrp || '',
        sellingPrice: variant?.sellingPrice || '',
        discountPercentage: variant?.discountPercentage || '',
        stock: variant?.stock || 0,
      })

      const attrs = variant?.attributes || {}
      Object.entries(attrs).forEach(([k, v]) => {
        form.setValue(`attr_${k}`, v)
      })

      if (Array.isArray(variant?.media) && variant.media.length > 0) {
        const media = variant.media.map((m) => ({ _id: m._id, url: m.secure_url }))
        setInitialMedia(media)
      } else {
        setInitialMedia([])
      }
    }
  }, [getVariant])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.put('/api/product-variant/update', values)
      if (!response.success) {
        throw new Error(response.message)
      }
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
          <h4 className='text-xl font-semibold'>Edit Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5">

          {!getVariantLoading && (
            <DynamicVariantForm
              form={form}
              onSubmit={onSubmit}
              loading={loading}
              productOption={productOption}
              selectedProductId={form.watch('product')}
              initialMedia={initialMedia}
              submitText="Save Changes"
            />
          )}

        </CardContent>
      </Card>

    </div>
  )
}

export default EditProductVariant