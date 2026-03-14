'use client'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { Button } from '@/components/ui/button'
import { WEBSITE_CHECKOUT, WEBSITE_LOGIN, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoCloseCircleOutline } from "react-icons/io5";
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'
import { showToast } from '@/lib/showToast';

const renderAttributes = (attributes) => {
    if (!attributes) return null
    const entries = typeof attributes?.entries === 'function'
        ? Array.from(attributes.entries())
        : Object.entries(attributes)

    return entries
        .filter(([, v]) => v !== undefined && v !== null && String(v).length)
        .map(([k, v]) => (
            <p key={k} className='text-sm'>{k}: {String(v)}</p>
        ))
}

const breadCrumb = {
    title: 'Cart',
    links: [
        { label: "Cart" }
    ]
}
const CartPage = () => {
    const dispatch = useDispatch()
    const cart = useSelector(store => store.cartStore)
    const authStore = useSelector(store => store.authStore)

    const [subtotal, setSubTotal] = useState(0)
    const [discount, setDiscount] = useState(0)

    useEffect(() => {
        const cartProducts = cart.products

        const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)

        const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)

        setSubTotal(totalAmount)
        setDiscount(discount)

    }, [cart])

    const handleCheckout = () => {
        if (!authStore?.auth?._id) {
            showToast('error', 'Please login to proceed to checkout.')
            window.location.href = WEBSITE_LOGIN
            return
        }
        window.location.href = WEBSITE_CHECKOUT
    }

    return (
        <div>
            <WebsiteBreadcrumb props={breadCrumb} />
            {cart.count === 0
                ?
                <section className='px-3 lg:px-12 xl:px-16 py-16 md:py-20'>
                    <div className='max-w-3xl mx-auto text-center'>
                        <h4 className='text-3xl md:text-4xl font-semibold text-black'>Your cart is empty!</h4>
                        <p className='text-gray-600 mt-3'>Browse the shop and add items to your cart.</p>

                        <div className='mt-7 flex justify-center'>
                            <Button type="button" asChild className='bg-[var(--primary)] text-black font-semibold hover:bg-black hover:text-white transition-colors'>
                                <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
                            </Button>
                        </div>

                    </div>
                </section>
                :
                <section className='px-3 lg:px-12 xl:px-16 py-10 md:py-14'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='flex lg:flex-nowrap flex-wrap gap-8 lg:gap-10'>
                            <div className='lg:w-[70%] w-full'>
                                <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
                                    <div className='border-b border-gray-200 bg-gray-50 px-5 py-4'>
                                        <h2 className='text-base font-semibold text-black'>Cart Items</h2>
                                    </div>

                                    <div className='divide-y divide-gray-100'>
                                        {cart.products.map(product => {
                                            const meta = renderAttributes(product.attributes) || (
                                                <>
                                                    {product.color ? <p className='text-sm'>Color: {product.color}</p> : null}
                                                    {product.size ? <p className='text-sm'>Size: {product.size}</p> : null}
                                                </>
                                            )

                                            return (
                                                <div key={product.variantId} className='p-5'>
                                                    <div className='flex flex-col md:flex-row md:items-center gap-4'>
                                                        <div className='flex items-start gap-4 min-w-0 flex-1'>
                                                            <div className='w-20 h-20 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0'>
                                                                <Image src={product.media || imgPlaceholder.src} width={80} height={80} alt={product.name} className='w-full h-full object-contain' />
                                                            </div>

                                                            <div className='min-w-0'>
                                                                <h4 className='text-[15px] font-medium text-black leading-snug truncate'>
                                                                    <Link href={WEBSITE_PRODUCT_DETAILS(product.url)} className='hover:text-[var(--primary)]'>
                                                                        {product.name}
                                                                    </Link>
                                                                </h4>
                                                                <div className='text-gray-500 mt-1'>
                                                                    {meta}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4 md:gap-6'>
                                                            <div className='text-sm text-gray-900'>
                                                                {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                            </div>

                                                            <div className='flex justify-center'>
                                                                <div className='flex justify-center items-center h-9 border border-gray-200 w-fit rounded-full bg-white'>
                                                                    <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer text-gray-700 hover:text-black' onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))}>
                                                                        <HiMinus />
                                                                    </button>
                                                                    <input type='text' value={product.qty} className='w-10 text-center border-none outline-offset-0 bg-transparent' readOnly />
                                                                    <button type='button' className='h-full w-10 flex justify-center items-center cursor-pointer text-gray-700 hover:text-black' onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}>
                                                                        <HiPlus />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className='text-sm font-semibold text-gray-900'>
                                                                {(product.sellingPrice * product.qty).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                            </div>

                                                            <button type='button' onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))} className='text-sm font-medium text-red-500 hover:text-red-600'>
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className='lg:w-[30%] w-full'>
                                <div className='rounded-xl border border-gray-200 bg-white shadow-sm p-5 sticky top-5'>
                                    <h4 className='text-lg font-semibold text-black mb-5'>Order Summary</h4>
                                    <div>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className='text-sm text-gray-600 py-2'>Subtotal</td>
                                                    <td className='text-end py-2 text-sm font-semibold text-black'>
                                                        {subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='text-sm text-gray-600 py-2'>Discount</td>
                                                    <td className='text-end py-2 text-sm font-semibold text-black'>
                                                        -{discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='text-sm text-gray-600 py-2'>Total</td>
                                                    <td className='text-end py-2 text-sm font-semibold text-black'>
                                                        {subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <Button type='button' className='w-full bg-[var(--primary)] text-black font-semibold mt-5 mb-3 hover:bg-black hover:text-white transition-colors' onClick={handleCheckout}>
                                            Proceed to Checkout
                                        </Button>
                                        <p className='text-center'>
                                            <Link href={WEBSITE_SHOP} className='text-sm text-gray-700 hover:underline'>Continue Shopping</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            }
        </div>
    )
}

export default CartPage