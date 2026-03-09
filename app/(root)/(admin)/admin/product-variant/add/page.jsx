'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import DynamicVariantForm from '@/components/Application/Admin/DynamicVariantForm'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
  { href: '', label: 'Add Product Variants' },
]

const AddProduct = () => {
  const [loading, setLoading] = useState(false)
  const [productOption, setProductOption] = useState([])
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&&size=10000')

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data
      const options = data.map((product) => ({ label: product.name, value: product._id }))
      setProductOption(options)
    }
  }, [getProduct])

  const form = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
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

  const onSubmit = async (payload) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/product-variant/create', payload)
      if (!response.success) {
        throw new Error(response.message)
      }

      form.reset()
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
          <h4 className='text-xl font-semibold'>Add Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <DynamicVariantForm
            form={form}
            onSubmit={onSubmit}
            loading={loading}
            productOption={productOption}
            selectedProductId={form.watch('product')}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProduct