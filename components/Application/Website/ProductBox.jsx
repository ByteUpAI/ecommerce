'use client'
import Image from 'next/image'
import React from 'react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import Link from 'next/link'
import { FaRegHeart } from 'react-icons/fa'
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'

const ProductBox = ({ product, wowDelay = '0.2s' }) => {
    const sellingPrice = product?.sellingPrice
        ? product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
        : null

    const mrp = product?.mrp
        ? product.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
        : null

    return (
        // wow fadeInRight — same as PHP data-wow-delay per card
        <div
            className="bg-white flex flex-col shadow-box relative overflow-hidden wow fadeInRight"
            data-wow-delay={wowDelay}
        >
            {/* Image + Quick View hover */}
            <div className="py-3 relative product-img group">
                <Image
                    src={product?.media?.[0]?.secure_url || imgPlaceholder.src}
                    width={240}
                    height={240}
                    alt={product?.media?.[0]?.alt || product?.name}
                    title={product?.media?.[0]?.title || product?.name}
                    className="size-40 lg:size-60 mx-auto p-8 object-contain"
                />
                <div className="product-view">
                    <Link
                        href={WEBSITE_PRODUCT_DETAILS(product.slug)}
                        className="btn-quick-view"
                    >
                        Quick View
                    </Link>
                </div>
            </div>

            {/* Info */}
            <div className="p-6 text-left flex flex-col shadow-top relative z-20 bg-white h-full">
                <div className="flex-1">
                    <Link
                        href={WEBSITE_PRODUCT_DETAILS(product.slug)}
                        className="text-xl lg:text-xl font-bold mb-2 block text-dark"
                    >
                        {product?.name}
                    </Link>

                    <div className="flex flex-col gap-2 justify-center">
                        {mrp && product?.mrp > product?.sellingPrice && (
                            <del className="text-sm text-gray-300">{mrp}</del>
                        )}
                        {sellingPrice && (
                            <p className="text-lg text-black font-bold">{sellingPrice}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                    <Link
                        href={WEBSITE_PRODUCT_DETAILS(product.slug)}
                        className="cart-btn"
                    >
                        Add to cart
                    </Link>
                    <button className="cart-btn-sm">
                        <FaRegHeart />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductBox