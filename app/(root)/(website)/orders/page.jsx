'use client'
import Loading from '@/components/Application/Loading'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'

import useFetch from '@/hooks/useFetch'
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import React from 'react'
const breadCrumbData = {
    title: 'Orders',
    links: [{ label: 'Orders' }]
}
const Orders = () => {
    const { data: orderData, loading } = useFetch("/api/user-order")

    return (
        <div>
            <WebsiteBreadcrumb props={breadCrumbData} />
            <section className='px-3 lg:px-6 xl:px-8 py-6 md:py-8 lg:py-10'>
                <UserPanelLayout>
                    <div>
                        <div className='p-5 md:p-6 text-xl font-semibold border-b border-gray-200'>
                            Orders
                        </div>
                        <div className='p-5 md:p-6'>
                            {loading ?
                                <div className='text-center py-5'>Loading...</div>
                                :
                                <div className='overflow-auto'>
                                    <table className='w-full min-w-[760px]'>
                                        <thead>
                                            <tr>
                                                <th className='text-start p-3 text-sm border-b border-gray-200 text-nowrap text-gray-500'>Sr.No.</th>
                                                <th className='text-start p-3 text-sm border-b border-gray-200 text-nowrap text-gray-500'>Order id</th>
                                                <th className='text-start p-3 text-sm border-b border-gray-200 text-nowrap text-gray-500'>Total Item</th>
                                                <th className='text-start p-3 text-sm border-b border-gray-200 text-nowrap text-gray-500'>Status</th>
                                                <th className='text-start p-3 text-sm border-b border-gray-200 text-nowrap text-gray-500'>Amount</th>
                                                <th className='text-start p-3 text-sm border-b border-gray-200 text-nowrap text-gray-500'>Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderData && orderData?.data?.map((order, i) => (
                                                <tr key={order._id} className='hover:bg-gray-50'>
                                                    <td className='text-start text-sm text-gray-500 p-3 font-bold'>{i + 1}</td>
                                                    <td className='text-start text-sm text-gray-500 p-3'><Link className='underline hover:text-blue-500 underline-offset-2' href={WEBSITE_ORDER_DETAILS(order.order_id)}>{order.order_id}</Link></td>
                                                    <td className='text-start text-sm text-gray-500 p-3'>
                                                        {order.products.length}
                                                    </td>
                                                    <td className='text-start text-sm text-gray-500 p-3 capitalize'>
                                                        {order.status}
                                                    </td>
                                                    <td className='text-start text-sm text-gray-500 p-3'>
                                                        {order.totalAmount.toLocaleString('en-In', { style: 'currency', currency: 'INR' })}
                                                    </td>
                                                    <td className='text-start text-sm text-gray-500 p-3'>
                                                        <Link className='underline hover:text-blue-500 underline-offset-2' href={`/api/orders/invoice/${order.order_id}`} target='_blank'>Invoice</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </UserPanelLayout>
            </section>
        </div>
    )
}

export default Orders