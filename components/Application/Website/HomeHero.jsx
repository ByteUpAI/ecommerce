'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { LuChevronRight } from 'react-icons/lu'
import MainSlider from '@/components/Application/Website/MainSlider'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const HomeHero = ({ sliderImages = [], hero = null }) => {
  const [slideIndex, setSlideIndex] = useState(0)

  const heroConfig = hero || {}
  const accentText = heroConfig.accentText || 'Innovation'
  const titleLine1 = heroConfig.titleLine1 || 'starts'
  const titleLine2 = heroConfig.titleLine2 || 'with a dream and a plan'
  const subtitle = heroConfig.subtitle || 'We offer flexible solutions which help your business to grow'
  const ctaText = heroConfig.ctaText || 'GO TO SHOP'
  const ctaLink = heroConfig.ctaLink || WEBSITE_SHOP

  return (
    <section className="relative">
      <style>{`
        @keyframes slideTextIn {
          0%   { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .slide-text {
          opacity: 0;
          animation: slideTextIn 0.8s ease forwards;
        }
        .slide-text:nth-child(1) { animation-delay: 0.2s; }
        .slide-text:nth-child(2) { animation-delay: 0.45s; }
        .slide-text:nth-child(3) { animation-delay: 0.65s; }
        .slide-text:nth-child(4) { animation-delay: 0.85s; }

        .et-slider-button {
          color: #fff;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
        }
        .et-slider-button:hover {
          background-color: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }
      `}</style>

      <MainSlider images={sliderImages} onSlideChange={setSlideIndex} />

      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full mx-auto px-6 py-8 lg:py-0 md:px-16 md:py-16">

          {/* key={slideIndex} forces full remount on every slide change → animation replays */}
          <div key={slideIndex} className="max-w-4xl">

            <h1 className="font-extrabold leading-tight">
              <span className="slide-text block text-[var(--primary)] text-4xl sm:text-5xl md:text-7xl">
                {accentText} {titleLine1}
              </span>
              <span className="slide-text block text-white text-4xl sm:text-5xl md:text-7xl">
                {titleLine2}
              </span>
            </h1>

            <p className="slide-text mt-6 text-gray-300 text-lg md:text-lg">
              {subtitle}
            </p>

            <div className="slide-text pointer-events-auto">
              <Link
                href={ctaLink}
                className="et-slider-button inline-block mt-8 border border-white px-8 py-3 text-sm uppercase tracking-widest transition duration-300"
              >
                {ctaText} <LuChevronRight className="inline" size={16} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero