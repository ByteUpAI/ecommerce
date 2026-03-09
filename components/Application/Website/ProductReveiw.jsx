'use client'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ButtonLoading from '../ButtonLoading'
import { useSelector } from 'react-redux'
import { Rating } from '@mui/material'
import { IoStar } from 'react-icons/io5'
import axios from 'axios'
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import ReviewList from './ReviewList'
import useFetch from '@/hooks/useFetch'

const ProductReveiw = ({ productId }) => {
    const queryClient = useQueryClient()
    const auth = useSelector(store => store.authStore.auth)
    const [loading, setLoading] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('')
    const [isReview, setIsReview] = useState(false)

    const { data: reviewDetails } = useFetch(`/api/review/details?productId=${productId}`)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href)
        }
    }, [])

    const formSchema = zSchema.pick({
        product: true,
        userId: true,
        rating: true,
        title: true,
        review: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: productId,
            userId: auth?._id,
            rating: 0,
            title: "",
            review: "",
        },
    })

    useEffect(() => {
        if (auth?._id) form.setValue('userId', auth._id)
    }, [auth, form])

    const handleReviewSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.post('/api/review/create', values)
            if (!response.success) throw new Error(response.message)

            form.reset({
                product: productId,
                userId: auth?._id,
                rating: 0,
                title: "",
                review: "",
            })
            showToast('success', response.message)
            setIsReview(false)
            queryClient.invalidateQueries(['product-review'])
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchReview = async (pageParam) => {
        const { data: getReviewData } = await axios.get(`/api/review/get?productId=${productId}&page=${pageParam}`)
        return getReviewData.success ? getReviewData.data : null
    }

    const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['product-review'],
        queryFn: async ({ pageParam }) => await fetchReview(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage?.nextPage
    })

    return (
        <div id="review" className="tab-content relative">
            <button
                className="add-review-btn !absolute right-0 top-0 cursor-pointer"
                onClick={() => setIsReview(!isReview)}
            >
                Add Review
            </button>

            <div className={`review-wrapper overflow-hidden transition-all duration-500 ${isReview ? 'max-h-[9999px] mb-10' : 'max-h-0'}`}>
                <div className="mb-6">
                    <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
                        before:content-[''] before:absolute before:left-0 before:top-1 before:-translate-y-1/10
                        before:w-6 before:h-80 before:border-l-5 before:border-[var(--primary)] text-dark">
                        Add a review
                    </h2>

                    <div className="border-b border-b-[var(--text-light)] pb-4 flex flex-col gap-3">
                        <p className="text-[var(--text-gray)]">Your email address will not be published. Required fields are marked *</p>

                        {!auth ? (
                            <div className="flex flex-col gap-3">
                                <p className="text-[var(--text-gray)]">Login to submit a review.</p>
                                <Link href={`${WEBSITE_LOGIN}?callback=${currentUrl}`} className="cart-btn w-fit">
                                    Login
                                </Link>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleReviewSubmit)}>
                                    <div className="mb-4 flex gap-3 items-center">
                                        <label>Your Rating *</label>
                                        <FormField
                                            control={form.control}
                                            name="rating"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex gap-1">
                                                            <Rating
                                                                value={Number(field.value)}
                                                                onChange={(_, newValue) => field.onChange(newValue)}
                                                                size="medium"
                                                                icon={<IoStar className="text-[var(--primary)]" fontSize="inherit" />}
                                                                emptyIcon={<IoStar className="text-[var(--text-light)]" fontSize="inherit" />}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="user_review">Your Review *</label>
                                        <FormField
                                            control={form.control}
                                            name="review"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-start border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition bg-white">
                                                            <textarea
                                                                {...field}
                                                                id="user_review"
                                                                rows="4"
                                                                className="w-full text-base ps-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent resize-none"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="review_title">Title *</label>
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition bg-white">
                                                            <input
                                                                {...field}
                                                                id="review_title"
                                                                type="text"
                                                                className="w-full text-base ps-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <ButtonLoading loading={loading} type="submit" text="Submit Review" className="cart-btn cursor-pointer" />
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
                        before:content-['']
                        before:absolute
                        before:left-0
                        before:top-1
                        before:-translate-y-1/10
                        before:w-6
                        before:h-80
                        before:border-l-5
                        before:border-[var(--primary)] text-dark">
                    Customer review
                </h2>

                <div className="flex flex-col gap-4">
                    {data?.pages?.map((page, i) => (
                        <React.Fragment key={i}>
                            {page?.reviews?.map(review => (
                                <ReviewList key={review._id} review={review} />
                            ))}
                        </React.Fragment>
                    ))}
                </div>

                {hasNextPage && (
                    <div className="mt-6">
                        <ButtonLoading
                            text="Load More"
                            type="button"
                            loading={isFetching}
                            onClick={() => fetchNextPage()}
                            className="cart-btn"
                        />
                    </div>
                )}

                {data?.pages?.[0]?.reviews?.length === 0 && (
                    <p className="text-[var(--text-gray)] mt-4">No reviews yet. Be the first to review this product!</p>
                )}
            </div>
        </div>
    )
}

export default ProductReveiw
