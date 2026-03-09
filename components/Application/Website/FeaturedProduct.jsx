import Link from 'next/link'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import ProductBox from './ProductBox'
import { getFeaturedProducts } from '@/lib/productService'

const FeaturedProduct = async () => {
    let productData = null
    try {
        const products = await getFeaturedProducts(8)
        productData = { success: true, data: products }
    } catch (error) {
        console.log(error)
    }

    if (!productData) return null

    return (
        <section className="py-12 md:py-18 lg:py-24 px-3 lg:px-8 xl:px-0 bg-center bg-no-repeat bg-contain relative">

            {/* Overlay */}
            <div className="absolute inset-0">
                <img
                    src="/assets/img/overlay_dark.png"
                    className="w-full h-full"
                    alt="img"
                />
            </div>

            <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">

                {/* Heading */}
                <div>
                    <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
                        before:content-['']
                        before:absolute
                        before:left-0
                        before:top-1
                        before:-translate-y-1/10
                        before:w-6
                        before:h-80
                        before:border-l-5
                        before:border-[var(--primary)]">
                        Featured Products
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {!productData.success && (
                        <div className="text-center py-5 col-span-full">
                            Data Not Found.
                        </div>
                    )}

                    {productData.success &&
                        productData.data.map((product, index) => (
                            <div
                                key={product._id}
                                className="wow fadeInRight"
                                data-wow-delay={`${0.2 + index * 0.2}s`}
                            >
                                <ProductBox product={product} />
                            </div>
                        ))}
                </div>

                {/* View All */}
                <div className="relative mt-14 text-center">
                    <Link href="/products" className="et-black-button">
                        View All <FaChevronRight className="inline ml-1" />
                    </Link>
                </div>

            </div>
        </section>
    )
}

export default FeaturedProduct
