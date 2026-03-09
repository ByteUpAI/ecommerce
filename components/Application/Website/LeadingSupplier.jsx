'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const LeadingSupplier = () => {
  return (
    <section className="py-12 md:py-18 lg:py-12 px-3 lg:px-8 xl:px-0 relative overflow-hidden">
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10">
        <img
          src="assets/img/overlay_dark.png"
          className="w-full h-full"
          alt="overlay"
        />
      </div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-fixed"
        style={{
          backgroundImage: "url('assets/img/industrial9.jpg')",
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Cross Right Gradient */}
      <div className="crose-right-grediunt" />

      {/* Content */}
      <div className="relative max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto z-20 py-12 lg:py-25">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
          
          {/* Empty Left Column */}
          <div />

          {/* Right Column */}
          <motion.div
            className="md:-ms-22 lg:-ms-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Title */}
            <div className="flex gap-2 items-end mb-4">
              <h2 className="text-88 font-extrabold text-black">Air Control</h2>
              <div className="mb-6">
                <span className="text-xl lg:text-3xl bg-black p-2 rounded-sm text-white">
                  Industries
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <motion.h3
              className="cta-crose-sub-title text-white font-extrabold mb-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Leading Supplier of <br /> Pneumatic &amp; Automation Solutions
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-2xl text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Providing complete pneumatic, valve control and automation solutions
              with reliable products, strong technical expertise and dependable
              customer support across industries.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="#" className="cta-crose-button">
                Explore Products
                <i className="fa-solid fa-angle-right" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default LeadingSupplier