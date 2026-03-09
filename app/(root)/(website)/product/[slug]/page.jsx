import axios from 'axios'
import React from 'react'
import ProductDetails from './ProductDetails'

const ProductPage = async ({ params, searchParams }) => {
    const { slug } = await params
    const resolvedSearchParams = await searchParams

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`

    // Build query string from all search params for dynamic attributes
    const queryParams = new URLSearchParams()
    if (resolvedSearchParams && typeof resolvedSearchParams === 'object') {
        Object.entries(resolvedSearchParams).forEach(([key, value]) => {
            if (value) queryParams.set(key, value)
        })
    }
    const queryString = queryParams.toString()
    if (queryString) {
        url += `?${queryString}`
    }

    const { data: getProduct } = await axios.get(url)

    if (!getProduct.success) {
        return (
            <div className='flex justify-center items-center py-10 h-[300px]'>
                <h1 className='text-4xl font-semibold'>Data not found.</h1>
            </div>
        )
    } else {

        return (
            <ProductDetails
                product={getProduct?.data?.product}
                variant={getProduct?.data?.variant}
                attributeOptions={getProduct?.data?.attributeOptions}
                variants={getProduct?.data?.variants}
                selectedAttributes={getProduct?.data?.selectedAttributes}
                reviewCount={getProduct?.data?.reviewCount}
            />
        )
    }

}

export default ProductPage