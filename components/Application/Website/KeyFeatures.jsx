'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChevronRight } from 'react-icons/fa'

const features = [
    {
        title: "Standard Operating Procedures",
        description: "SOPs for smooth order processing, dispatch, and service excellence."
    },
    {
        title: "Fast Delivery Network",
        description: "Safe and timely deliveries ensuring customer satisfaction."
    },
    {
        title: "Quality Assurance",
        description: "Rigorous quality checks on all products before delivery."
    },
    {
        title: "After-Sales Service",
        description: "Dedicated support team for post-purchase assistance."
    }
]

const KeyFeatures = () => {

    useEffect(() => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show")
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.4 })

        document.querySelectorAll(".reveal-line").forEach(el => {
            observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <section className="w-full bg-[#212121] bg-contain w-full bg-center bg-no-repeat" style={{ backgroundImage: "url('assets/img/map_transparent_white.png')" }}>
            <div className="grid grid-cols-1 xl:grid-cols-2">

                {/* Left Content Section */}
                <div
                    className="flex items-center bg-cover w-full bg-center"
                    
                >
                    <div className="mx-auto px-6 py-6 md:py-18 md:px-10 xl:px-14 xl:py-15 2xl:px-32 2xl:py-24">

                        {/* Heading */}
                        <h2 className="md:text-6xl font-bold why-choose-white text-white">
                            <span className="relative inline-block">
                                <span
                                    className="relative z-10 reveal-line
                                        before:content-['']
                                        before:absolute
                                        before:left-0
                                        before:bottom-5
                                        before:-translate-y-1/10
                                        before:block
                                        before:w-full
                                        before:h-4
                                        before:-z-10
                                        before:bg-[var(--primary)]"
                                >
                                    Key
                                </span>
                            </span>
                            {' '}Features
                        </h2>

                        {/* Paragraph */}
                        <p className="mt-7 text-white text-2xl">
                            Learn more about the ways in which our innovation is helping evolve expectations for businesses and manufacturers alike.
                        </p>

                        {/* Features Grid */}
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="text-[var(--primary)] text-3xl">
                                        <FaChevronRight className="mt-1" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-2xl">
                                            {feature.title}
                                        </h4>
                                        <p className="text-lg text-white mt-2 line-clamp-2">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Right Parallax Image Section */}
                <div className="parallax-wrapper relative md:h-[640px] lg:h-[300px] lg:h-auto overflow-hidden">
                    <div
                        className="parallax-bg absolute"
                        style={{ backgroundImage: "url('assets/img/industrial2.jpg')" }}
                    />
                </div>

            </div>
        </section>
    )
}

export default KeyFeatures