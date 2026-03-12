'use client'
import Filter from '@/components/Application/Website/Filter'
import Sorting from '@/components/Application/Website/Sorting'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import React, { useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import ProductBox from '@/components/Application/Website/ProductBox'
import ButtonLoading from '@/components/Application/ButtonLoading'

const breadcrumb = {
    title: 'Shop',
    links: [
        { label: 'Shop', href: WEBSITE_SHOP }
    ]
}

const Shop = () => {
    const searchParams = useSearchParams().toString()
    const [limit, setLimit] = useState(9)
    const [sorting, setSorting] = useState('default_sorting')
    const [isMobileFilter, setIsMobileFilter] = useState(false)

    const fetchProduct = async (pageParam) => {
        const { data: getProduct } = await axios.get(`/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`)
        if (!getProduct.success) return
        return getProduct.data
    }

    const { error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['products', limit, sorting, searchParams],
        queryFn: async ({ pageParam }) => await fetchProduct(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage
    })

    const totalProducts = data?.pages?.reduce((acc, page) => acc + (page?.products?.length || 0), 0) || 0

    return (
        <div>
            {/* Breadcrumb hero */}
            <WebsiteBreadcrumb props={breadcrumb} />

            <section className="pb-24 px-3 lg:px-8  xl:px-0 bg-center bg-no-repeat bg-contain relative">
                <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">
                    <div className="lg:flex">

                        {/* SIDEBAR — always visible on desktop, slide-in on mobile */}
                        <div className="lg:w-4/12 xl:w-3/12 lg:pr-12">

                            {/* Mobile: dark overlay */}
                            <div
                                onClick={() => setIsMobileFilter(false)}
                                className={`fixed inset-0 bg-black/50 transition-opacity z-40 lg:hidden
                                    ${isMobileFilter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                            />
                            

                            {/* Panel: fixed+slide on mobile | static+always-visible on desktop */}
                            <div className={`
                                fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white
                                transition-transform duration-300 z-50 overflow-y-auto
                                lg:static lg:translate-x-0 lg:w-full p-5 lg:p-0
                                ${isMobileFilter ? 'translate-x-0' : '-translate-x-full'}
                            `}>
                                <Filter onClose={() => setIsMobileFilter(false)} />
                            </div>
                           
                        </div>
                              
                        {/* PRODUCT AREA */}
                        <div className="lg:w-8/12 xl:w-9/12 mt-8 lg:mt-0">
                            <Sorting
                                limit={limit}
                                setLimit={setLimit}
                                sorting={sorting}
                                setSorting={setSorting}
                                mobileFilterOpen={isMobileFilter}
                                setMobileFilterOpen={setIsMobileFilter}
                                totalProducts={totalProducts}
                            />

                            {isFetching && <div className="p-3 font-semibold text-center">Loading...</div>}
                            {error && <div className="p-3 font-semibold text-center text-red-500">{error.message}</div>}

                            {/* Grid — WOW delay passed per card */}
                            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mt-0">
                                {data?.pages?.map((page) =>
                                    page?.products?.map((product, index) => (
                                        <ProductBox
                                            key={product._id}
                                            product={product}
                                            wowDelay={`${((index % 3) + 1) * 0.2}s`}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Load more */}
                            <div className="flex justify-center mt-14">
                                {hasNextPage ? (
                                    <ButtonLoading
                                        type="button"
                                        loading={isFetching}
                                        text="Load More"
                                        onClick={fetchNextPage}
                                        className="cart-btn"
                                    />
                                ) : (
                                    !isFetching && data && (
                                        <span className="text-[var(--text-gray)]">No more data to load.</span>
                                    )
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Shop