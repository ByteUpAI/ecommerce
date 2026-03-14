'use client'
import ButtonLoading from '@/components/Application/ButtonLoading'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { addIntoCart, clearCart } from '@/store/reducer/cartReducer'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaShippingFast } from "react-icons/fa";
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

import loading from '@/public/assets/images/loading.svg'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'

const getAttrValue = (attrs, key) => {
    if (!attrs) return undefined
    if (typeof attrs.get === 'function') return attrs.get(key)
    return attrs?.[key]
}

const renderAttributes = (attributes, attributeConfig) => {
    if (!attributes) return null

    const config = Array.isArray(attributeConfig) ? attributeConfig : []
    if (config.length) {
        return config
            .map((attr) => {
                const value = getAttrValue(attributes, attr.key)
                if (value === undefined || value === null || !String(value).length) return null
                const unit = attr.unit ? ` ${attr.unit}` : ''
                return (
                    <p key={attr.key} className='text-sm'>
                        {attr.label || attr.key}: {String(value)}{unit}
                    </p>
                )
            })
            .filter(Boolean)
    }

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
    title: 'Checkout',
    links: [
        { label: "Checkout" }
    ]
}
const Checkout = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const cart = useSelector(store => store.cartStore)
    const authStore = useSelector(store => store.authStore)
    const [verifiedCartData, setVerifiedCartData] = useState([])
    const [isCouponApplied, setIsCouponApplied] = useState(false)
    const [subtotal, setSubTotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [couponLoading, setCouponLoading] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [placingOrder, setPlacingOrder] = useState(false)
    const [savingOrder, setSavingOrder] = useState(false)

    const { data: getVerifiedCartData } = useFetch('/api/cart-verification', 'POST', { data: cart.products })

    useEffect(() => {
        if (!authStore?.auth?._id) {
            showToast('error', 'Please login to continue checkout.')
            router.push(WEBSITE_LOGIN)
        }
    }, [authStore?.auth?._id])

    useEffect(() => {
        if (getVerifiedCartData && getVerifiedCartData.success) {
            const cartData = getVerifiedCartData.data
            setVerifiedCartData(cartData)
            dispatch(clearCart())
            cartData.forEach(cartItem => {
                dispatch(addIntoCart(cartItem))
            });
        }
    }, [getVerifiedCartData])

    useEffect(() => {
        const cartProducts = cart.products

        const subTotalAmount = cartProducts.reduce((sum, product) => sum + (product.mrp * product.qty), 0)
        const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)
        const payableBeforeCoupon = subTotalAmount - discount

        setSubTotal(subTotalAmount)
        setDiscount(discount)
        setTotalAmount(payableBeforeCoupon - (couponDiscountAmount || 0))

        couponForm.setValue('minShoppingAmount', payableBeforeCoupon)

    }, [cart, couponDiscountAmount])

    const couponFormSchema = zSchema.pick({
        code: true,
        minShoppingAmount: true
    })

    const couponForm = useForm({
        resolver: zodResolver(couponFormSchema),
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            code: "",
            minShoppingAmount: subtotal
        }
    })

    const applyCoupon = async (values) => {
        setCouponLoading(true)
        try {
            const { data: response } = await axios.post('/api/coupon/apply', values)
            if (!response.success) {
                throw new Error(response.message)
            }

            const discountPercentage = response.data.discountPercentage

            const payableBeforeCoupon = subtotal - discount
            const couponAmount = (payableBeforeCoupon * discountPercentage) / 100

            setCouponDiscountAmount(couponAmount)
            setTotalAmount(payableBeforeCoupon - couponAmount)
            showToast('success', response.message)
            setCouponCode(couponForm.getValues('code'))
            setIsCouponApplied(true)

            couponForm.resetField('code', '')
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setCouponLoading(false)
        }
    }

    const removeCoupon = () => {
        setIsCouponApplied(false)
        setCouponCode('')
        setCouponDiscountAmount(0)
        setTotalAmount(subtotal - discount)
    }

    const orderFormSchema = zSchema.pick({
        name: true,
        email: true,
        phone: true,
        country: true,
        state: true,
        city: true,
        pincode: true,
        landmark: true,
        ordernote: true
    }).extend({
        userId: z.string().optional()
    })

    const orderForm = useForm({
        resolver: zodResolver(orderFormSchema),
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            country: '',
            state: '',
            city: '',
            pincode: '',
            landmark: '',
            ordernote: '',
            userId: authStore?.auth?._id,
        }
    })

    useEffect(() => {
        if (authStore) {
            orderForm.setValue('userId', authStore?.auth?._id)
        }
    }, [authStore])

    const placeOrder = async (formData) => {
        if (!authStore?.auth?._id) {
            showToast('error', 'Please login to place an order.')
            router.push(WEBSITE_LOGIN)
            return
        }
        setPlacingOrder(true)
        try {
            setSavingOrder(true)

            const products = (verifiedCartData || []).map((cartItem) => (
                {
                    productId: cartItem.productId,
                    variantId: cartItem.variantId,
                    name: cartItem.name,
                    qty: cartItem.qty,
                    mrp: cartItem.mrp,
                    sellingPrice: cartItem.sellingPrice,
                }
            ))

            const { data: placeOrderResponse } = await axios.post('/api/orders/place', {
                ...formData,
                products,
                subtotal,
                discount,
                couponDiscountAmount,
                totalAmount
            })

            if (!placeOrderResponse.success) {
                throw new Error(placeOrderResponse.message)
            }

            showToast('success', placeOrderResponse.message)
            dispatch(clearCart())
            orderForm.reset()
            router.push(WEBSITE_ORDER_DETAILS(placeOrderResponse?.data?.order_id))

        } catch (error) {
            showToast('error', error.message)
        } finally {
            setPlacingOrder(false)
            setSavingOrder(false)
        }
    }

    return (
        <div>

            {savingOrder &&
                <div className='h-screen w-screen fixed top-0 left-0 z-50 bg-black/10'>
                    <div className='h-screen flex justify-center items-center'>
                        <Image src={loading.src} height={80} width={80} alt='Loading' />
                        <h4 className='font-semibold'>Order Confirming...</h4>
                    </div>
                </div>
            }

            <WebsiteBreadcrumb props={breadCrumb} />
            {cart.count === 0
                ?
                <div className='w-screen h-[500px] flex justify-center items-center py-32'>
                    <div className='text-center'>
                        <h4 className='text-4xl font-semibold mb-5'>Your cart is empty!</h4>

                        <Button type="button" asChild>
                            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
                        </Button>

                    </div>
                </div>
                :
                <section className="lg:pb-24 pb-12 md:pb-18 px-3 lg:px-8 xl:px-0 relative my-20 w-full">
                    <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">
                        <Form {...orderForm}>
                            <form
                                className="grid gap-8"
                                style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}
                                ref={(el) => {
                                    if (el) {
                                        const applyLayout = () => {
                                            if (window.innerWidth >= 1024) {
                                                el.style.gridTemplateColumns = '1fr 360px'
                                            } else {
                                                el.style.gridTemplateColumns = '1fr'
                                            }
                                        }
                                        applyLayout()
                                        window.removeEventListener('resize', el._resizeHandler)
                                        el._resizeHandler = applyLayout
                                        window.addEventListener('resize', el._resizeHandler)
                                    }
                                }}
                                onSubmit={orderForm.handleSubmit(placeOrder)}
                            >
                                {/* LEFT: Billing Details */}
                                <div className="min-w-0">
                                    <div className="bg-white shadow p-6 pb-7">
                                        <h3 className="text-xl font-bold mb-5">Billing Details</h3>
                                        <div className="flex flex-col gap-y-4">
                                            {/* Row 1: Name and Email */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                                                <FormField
                                                    control={orderForm.control}
                                                    name='name'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="f_name" className="text-sm font-medium">Full Name *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input {...field} id="f_name" className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={orderForm.control}
                                                    name='email'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="email" className="text-sm font-medium">Email *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input type="email" {...field} id="email" className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Row 2: Phone, Country, State */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-4">
                                                <FormField
                                                    control={orderForm.control}
                                                    name='phone'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="p_number" className="text-sm font-medium">Phone Number *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input {...field} type="tel" id="p_number" maxLength={10} className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={orderForm.control}
                                                    name='country'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="country" className="text-sm font-medium">Country *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input {...field} id="country" className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={orderForm.control}
                                                    name='state'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="state" className="text-sm font-medium">State *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input {...field} id="state" className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Row 3: Pincode, City, Landmark */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-4">
                                                <FormField
                                                    control={orderForm.control}
                                                    name='pincode'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="pincode" className="text-sm font-medium">Pincode *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input {...field} id="pincode" maxLength={6} className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={orderForm.control}
                                                    name='city'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="city" className="text-sm font-medium">City *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input {...field} id="city" className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={orderForm.control}
                                                    name='landmark'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <label htmlFor="landmark" className="text-sm font-medium">Landmark *</label>
                                                            <FormControl>
                                                                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                    <input {...field} id="landmark" className="w-full text-base px-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Row 4: Order Note */}
                                            <FormField
                                                control={orderForm.control}
                                                name='ordernote'
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <label htmlFor="order_note" className="text-sm font-medium">Order Note</label>
                                                        <FormControl>
                                                            <div className="flex items-start border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                                                                <textarea
                                                                    {...field}
                                                                    id="order_note"
                                                                    rows="2"
                                                                    className="w-full text-base ps-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Your Order */}
                                <div className="w-full lg:w-[380px] lg:shrink-0">
                                    <div className="bg-white shadow p-5 sticky top-5">
                                        <h3 className="text-xl font-bold mb-5">Order Summary</h3>
                                        <div className="max-h-[300px] overflow-y-auto pr-2 mb-4">
                                            {verifiedCartData && verifiedCartData?.map(product => (
                                                <div key={product.variantId} className="flex gap-4 mb-4">
                                                    <div className="border border-[var(--text-light)] p-2 w-16 h-16 flex-shrink-0">
                                                        <Image src={product.media || imgPlaceholder.src} width={64} height={64} alt={product.name} className="object-contain w-full h-full" />
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <Link href={WEBSITE_PRODUCT_DETAILS(product.url)} className="text-lg lg:text-base xl:text-lg font-semibold hover:text-[var(--primary)] line-clamp-1">{product.name}</Link>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                            <p className="text-sm flex items-center gap-2 relative after:content-['|'] after:ms-2 after:text-[var(--text-gray)] after:text-xl">
                                                                <span><span>Qty:</span> {product.qty}</span>
                                                            </p>
                                                            <p className="text-sm font-medium">{product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                                        </div>
                                                        {renderAttributes(product.attributes, product.attributeConfig)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border border-dashed border-gray-300 mb-4"></div>

                                        {/* Coupon Section */}
                                        <h4 className="text-base text-[var(--text-gray)] mb-2">Apply Coupon Code</h4>
                                        <div className="mt-2 mb-6">
                                            {!isCouponApplied
                                                ?
                                                <div className="flex items-center rounded transition focus-within:ring-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Coupon Code"
                                                        className="border border-[var(--text-light)] border-r-0 w-full text-sm h-11 px-3 py-3 outline-none bg-transparent"
                                                        value={couponCode}
                                                        onChange={(e) => {
                                                            setCouponCode(e.target.value)
                                                            couponForm.setValue('code', e.target.value)
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={couponForm.handleSubmit(applyCoupon)}
                                                        className="btn-dark whitespace-nowrap h-11 cursor-pointer disabled:opacity-50"
                                                        disabled={couponLoading || !couponCode}
                                                    >
                                                        {couponLoading ? '...' : 'Apply Now'}
                                                    </button>
                                                </div>
                                                :
                                                <div className='flex justify-between items-center py-2 px-4 rounded bg-gray-100 border border-dashed border-[var(--primary)]'>
                                                    <div>
                                                        <span className='text-[10px] uppercase text-[var(--text-gray)]'>Applied Coupon</span>
                                                        <p className='text-sm font-bold'>{couponCode}</p>
                                                    </div>
                                                    <button type='button' onClick={removeCoupon} className='text-red-500 cursor-pointer hover:text-red-700 transition'>
                                                        <IoCloseCircleSharp size={22} />
                                                    </button>
                                                </div>
                                            }
                                        </div>

                                        <div className="border border-dashed border-gray-300 mb-4"></div>

                                        {/* Summary Table */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between">
                                                <div className="text-[var(--text-gray)]">Subtotal</div>
                                                <div className="font-semibold">{subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="text-[var(--text-gray)]">Discount</div>
                                                <div className="text-green-600 font-semibold">- {discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="text-[var(--text-gray)]">Coupon</div>
                                                <div className="font-semibold">- {couponDiscountAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                                            </div>
                                            <div className="border border-dashed border-gray-300"></div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <div className="text-[var(--text-gray)]">Total</div>
                                                <div>{totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6">
                                            <ButtonLoading
                                                type="submit"
                                                text="Place Order"
                                                loading={placingOrder}
                                                className="cart-btn w-full py-4 text-center cursor-pointer rounded-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </section>
            }

        </div>
    )
}

export default Checkout