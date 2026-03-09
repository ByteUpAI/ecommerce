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
                <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
                    <div className='lg:w-[60%] w-full'>
                        <div className='flex font-semibold gap-2 items-center'>
                            <FaShippingFast size={25} /> Shipping Address:
                        </div>
                        <div className='mt-5'>

                            <Form {...orderForm}>
                                <form className='grid grid-cols-2 gap-5' onSubmit={orderForm.handleSubmit(placeOrder)}>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Full name*" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Email*" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='phone'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder="Phone*"
                                                            inputMode="numeric"
                                                            maxLength={10}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='country'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Country*" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='state'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="State*" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='city'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="City*" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='pincode'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Pincode*"
                                                            inputMode="numeric"
                                                            maxLength={6}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3'>
                                        <FormField
                                            control={orderForm.control}
                                            name='landmark'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Landmark*" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>
                                    <div className='mb-3 col-span-2'>
                                        <FormField
                                            control={orderForm.control}
                                            name='ordernote'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea placeholder="Enter order note" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        >

                                        </FormField>
                                    </div>

                                    <div className='mb-3'>
                                        <ButtonLoading type="submit" text="Place Order" loading={placingOrder} className="bg-black rounded-full px-5 cursor-pointer" />
                                    </div>

                                </form>
                            </Form>
                        </div>

                    </div>
                    <div className='lg:w-[40%] w-full'>
                        <div className='rounded bg-gray-50 p-5 sticky top-5'>
                            <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
                            <div>

                                <table className='w-full border'>
                                    <tbody>
                                        {verifiedCartData && verifiedCartData?.map(product => (
                                            <tr key={product.variantId}>
                                                <td className='p-3'>
                                                    <div className='flex items-center gap-5'>
                                                        <Image src={product.media} width={60} height={60} alt={product.name} className='rounded' />
                                                        <div>
                                                            <h4 className='font-medium line-clamp-1'>
                                                                <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                                                            </h4>
                                                            {renderAttributes(product.attributes) || (
                                                                <>
                                                                    {product.color ? <p className='text-sm'>Color: {product.color}</p> : null}
                                                                    {product.size ? <p className='text-sm'>Size: {product.size}</p> : null}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='p-3 text-center'>
                                                    <p className='text-nowrap text-sm'>
                                                        {product.qty} x {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <table className='w-full'>
                                    <tbody>
                                        <tr>
                                            <td className='font-medium py-2'>Subtotal</td>
                                            <td className='text-end py-2'>
                                                {subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='font-medium py-2'>Discount</td>
                                            <td className='text-end py-2'>
                                                - {discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='font-medium py-2'>Coupon Discount</td>
                                            <td className='text-end py-2'>
                                                -  {couponDiscountAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='font-medium py-2 text-xl'>Total</td>
                                            <td className='text-end py-2'>
                                                {totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className='mt-2 mb-5'>
                                    {!isCouponApplied
                                        ?
                                        <Form {...couponForm}>
                                            <form className='flex justify-between gap-5' onSubmit={couponForm.handleSubmit(applyCoupon)}>
                                                <div className='w-[calc(100%-100px)]'>
                                                    <FormField
                                                        control={couponForm.control}
                                                        name='code'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input placeholder="Enter coupon code" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    >

                                                    </FormField>
                                                </div>
                                                <div className='w-[100px]'>
                                                    <ButtonLoading type="submit" text="Apply" className="w-full cursor-pointer" loading={couponLoading} />
                                                </div>
                                            </form>
                                        </Form>
                                        :
                                        <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200'>
                                            <div>
                                                <span className='text-xs'>Coupon:</span>
                                                <p className='text-sm font-semibold'>{couponCode}</p>
                                            </div>
                                            <button type='button' onClick={removeCoupon} className='text-red-500 cursor-pointer'>
                                                <IoCloseCircleSharp size={25} />
                                            </button>
                                        </div>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default Checkout