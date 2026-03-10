import React from 'react'
import HomeHero from '@/components/Application/Website/HomeHero'
import ServicesGrid from '@/components/Application/Website/ServicesGrid'
import WhyChooseUs from '@/components/Application/Website/WhyChooseUs'
import KeyFeatures from '@/components/Application/Website/KeyFeatures'
import PartnersGrid from '@/components/Application/Website/PartnersGrid'
import FeaturedProduct from '@/components/Application/Website/FeaturedProduct'
import Testimonial from '@/components/Application/Website/Testimonial'
import OurStory from '@/components/Application/Website/OurStory'
import LeadingSupplier from '@/components/Application/Website/LeadingSupplier'
import { getSiteConfigGroup } from '@/lib/getSiteConfig'
import { getCategories } from '@/lib/categoryService'

export const dynamic = 'force-dynamic'

const Home = async () => {
    let homeConfig = null
    let categories = []
    let testimonials = []

    try {
        const config = await getSiteConfigGroup('home')
        homeConfig = { success: true, data: config }
    } catch (error) {
        console.error('Home config fetch error:', error.message)
        homeConfig = null
    }

    const hero = homeConfig?.data?.hero || null
    const sliderImages = homeConfig?.data?.sliderImages || []
    const brandsMarqueeCompanies = homeConfig?.data?.brandsMarqueeCompanies || []
    const homeConfigTestimonials = homeConfig?.data?.testimonials || []

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/testimonials`, { cache: 'no-store' })
        const data = await res.json()

        testimonials = data?.success ? (data?.data || []) : []
    } catch (error) {
        console.error('Testimonials fetch error:', error.message)
        testimonials = []
    }

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
        testimonials = homeConfigTestimonials
    }

    try {
        categories = await getCategories()
    } catch (error) {
        console.error('Categories fetch error:', error.message)
        categories = []
    }

    return (
        <>
            <HomeHero sliderImages={sliderImages} hero={hero} />

            <ServicesGrid categories={categories} />

            <WhyChooseUs />

            <KeyFeatures />

            <Testimonial testimonials={testimonials} />

            <PartnersGrid companies={brandsMarqueeCompanies} />

            <OurStory/>
            
            <LeadingSupplier/>
            
            <FeaturedProduct />
        </>
    )
}

export default Home