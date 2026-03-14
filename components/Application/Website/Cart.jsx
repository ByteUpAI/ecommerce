'use client'
import { BsCart2 } from "react-icons/bs";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { removeFromCart } from "@/store/reducer/cartReducer";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT, WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { showToast } from "@/lib/showToast";

const Cart = ({ iconSize = 25, iconClassName = "text-gray-500 hover:text-primary", badgeClassName = "absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1" }) => {
    const [open, setOpen] = useState(false)
    const [subtotal, setSubTotal] = useState(0)
    const [discount, setDiscount] = useState(0)


    const cart = useSelector(store => store.cartStore)
    const authStore = useSelector(store => store.authStore)
    const dispatch = useDispatch()


    useEffect(() => {
        const cartProducts = cart.products

        const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)

        const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)


        setSubTotal(totalAmount)
        setDiscount(discount)



    }, [cart])


    return (
        <Sheet open={open} onOpenChange={setOpen} >
            <SheetTrigger className="relative">
                <BsCart2 size={iconSize} className={iconClassName} />
                <span className={badgeClassName}>{cart.count}</span>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[450px] w-full p-0">
                <SheetHeader className='px-5 py-4 border-b border-gray-200'>
                    <SheetTitle className="text-xl font-semibold text-black">My Cart</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className="h-[calc(100vh-72px)] flex flex-col">
                    <div className="flex-1 overflow-auto px-5 py-4">
                        {cart.count === 0 && (
                            <div className="h-full flex flex-col justify-center items-center text-center">
                                <div className="text-lg font-semibold text-black">Your cart is empty</div>
                                <div className="text-sm text-gray-500 mt-1">Add items from the shop to see them here.</div>
                            </div>
                        )}

                        {cart.products?.map(product => {
                            const meta = [product?.size, product?.color].filter(Boolean).join(' / ')

                            return (
                                <div key={product.variantId} className="flex items-start justify-between gap-4 py-4 border-b border-gray-100">
                                    <div className="flex gap-4 items-start min-w-0">
                                        <div className="w-20 h-20 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <Image src={product?.media || imgPlaceholder.src} height={80} width={80} alt={product.name} className="w-full h-full object-contain" />
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="text-[15px] font-medium text-black leading-snug truncate">{product.name}</h4>
                                            {meta ? (
                                                <p className="text-sm text-gray-500 mt-1 truncate">{meta}</p>
                                            ) : null}
                                            <p className="text-sm text-gray-900 font-semibold mt-2">
                                                {product.qty} x {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="text-sm font-medium text-red-500 hover:text-red-600 transition whitespace-nowrap"
                                        onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    <div className="border-t border-gray-200 px-5 py-4 bg-white">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-black">{subtotal?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Discount</span>
                                <span className="font-semibold text-black">{discount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4 gap-4">
                            <Button type="button" asChild variant="outline" className="flex-1 h-11 bg-white border-gray-300 text-black hover:bg-gray-50" onClick={() => setOpen(false)}>
                                <Link href={WEBSITE_CART}>View Cart</Link>
                            </Button>

                            {cart.count ? (
                                <Button
                                    type="button"
                                    className="flex-1 h-11 bg-[var(--primary)] text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300"
                                    onClick={() => {
                                        if (!authStore?.auth?._id) {
                                            showToast('error', 'Please login to proceed to checkout.')
                                            setOpen(false)
                                            window.location.href = WEBSITE_LOGIN
                                            return
                                        }
                                        setOpen(false)
                                        window.location.href = WEBSITE_CHECKOUT
                                    }}
                                >
                                    Checkout
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    className="flex-1 h-11 bg-[var(--primary)] text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300"
                                    onClick={() => showToast('error', 'Your cart is empty!')}
                                >
                                    Checkout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

            </SheetContent>
        </Sheet>

    )
}

export default Cart