'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const IndustrialHero = ({ title = "Great technology", subtitle = "means optimal value", description = "We offer flexible solutions which help your business to grow" }) => {
    return (
        <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-black/40" />
            </div>
            
            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4">
                        <span className="text-primary">{title}</span>
                        <br />
                        {subtitle}
                    </h1>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        {description}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-black px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Explore Products
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}

export default IndustrialHero
