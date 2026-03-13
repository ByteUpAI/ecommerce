'use client'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import useFetch from '@/hooks/useFetch';
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute';
import Link from 'next/link';
import React from 'react'
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

const breadCrumbData = {
    title: 'Dashboard',
    links: [{ label: 'Dashboard' }]
}
const MyAccount = () => {
    const { data: dashboardData } = useFetch('/api/dashboard/user')
    const cartStore = useSelector(store => store.cartStore)

    return (
        <div>
            <WebsiteBreadcrumb props={breadCrumbData} />
            <section className='px-3 py-6 md:py-8'>
                <div className='w-full'>
                    <UserPanelLayout>
                        <div className='bg-white shadow border border-gray-100'>
                            <div className='p-6 md:p-8 border-b'>
                                <h1 className='text-2xl md:text-3xl font-bold'>Dashboard</h1>
                                <p className='text-[var(--text-light)] mt-2'>Track orders and view quick stats.</p>
                            </div>

                            <div className='p-6 md:p-8'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='flex items-center justify-between gap-5 border border-gray-100 rounded p-5'>
                                        <div>
                                            <h4 className='font-bold text-lg mb-1'>Total Orders</h4>
                                            <span className='font-semibold text-[var(--text-light)]'>{dashboardData?.data?.totalOrder || 0}</span>
                                        </div>
                                        <div className='w-14 h-14 bg-[var(--primary)] rounded-full flex justify-center items-center'>
                                            <HiOutlineShoppingBag className='text-white' size={22} />
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between gap-5 border border-gray-100 rounded p-5'>
                                        <div>
                                            <h4 className='font-bold text-lg mb-1'>Items In Cart</h4>
                                            <span className='font-semibold text-[var(--text-light)]'>{cartStore?.count}</span>
                                        </div>
                                        <div className='w-14 h-14 bg-[var(--primary)] rounded-full flex justify-center items-center'>
                                            <IoCartOutline className='text-white' size={22} />
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-10'>
                                    <div className='flex items-center justify-between gap-4 mb-4'>
                                        <h2 className='text-xl font-bold'>Recent Orders</h2>
                                    </div>

                                    <div className='border border-gray-100 rounded overflow-auto'>
                                        <table className='w-full min-w-[760px]'>
                                            <thead>
                                                <tr className='bg-gray-50'>
                                                    <th className='text-start p-3 text-sm border-b text-nowrap text-gray-500'>Sr.No.</th>
                                                    <th className='text-start p-3 text-sm border-b text-nowrap text-gray-500'>Order id</th>
                                                    <th className='text-start p-3 text-sm border-b text-nowrap text-gray-500'>Total Item</th>
                                                    <th className='text-start p-3 text-sm border-b text-nowrap text-gray-500'>Status</th>
                                                    <th className='text-start p-3 text-sm border-b text-nowrap text-gray-500'>Amount</th>
                                                    <th className='text-start p-3 text-sm border-b text-nowrap text-gray-500'>Invoice</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData && dashboardData?.data?.recentOrders?.map((order, i) => (
                                                    <tr key={order._id} className='hover:bg-gray-50'>
                                                        <td className='text-start text-sm text-gray-500 p-3 font-bold'>{i + 1}</td>
                                                        <td className='text-start text-sm text-gray-500 p-3'>
                                                            <Link className='underline hover:text-blue-500 underline-offset-2' href={WEBSITE_ORDER_DETAILS(order.order_id)}>
                                                                {order.order_id}
                                                            </Link>
                                                        </td>
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
                                                            <Link className='underline hover:text-blue-500 underline-offset-2' href={`/api/orders/invoice/${order.order_id}`} target='_blank'>
                                                                Invoice
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UserPanelLayout>
                </div>
            </section>
        </div>
    )
}

export default MyAccount