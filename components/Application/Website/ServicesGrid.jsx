'use client'
import Link from 'next/link'
import { LuImage, LuChevronRight } from 'react-icons/lu'

const ServicesGrid = ({ categories = [] }) => {
  const items = Array.isArray(categories) ? categories.slice(0, 6) : []

  return (
    <section className="relative py-12 md:py-18 lg:py-24 overflow-hidden">
    <div className="top-gradient gradient"></div>
      {/* Background pattern */}
    <div className="absolute inset-0  bg-[url('/assets/img/map_transparent_dark.png')] bg-center bg-no-repeat bg-contain" ></div>

      {/* Overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/img/overlay_dark.png"
          className="w-full h-full"
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* Container */}
      <div className="relative z-10 max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 lg:px-8 xl:px-0 z-10">

        {/* Section Title */}
        <div className="mb-6">
          <span className="uppercase text-sm border-l-4 border-[var(--primary)] pl-3 font-bold">
            Shop by Category
          </span>
        </div>

        {/* GRID — border on wrapper top+left, each card adds bottom+right = seamless grid lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-gray-200 shadow-[0_8px_24px_0_rgb(0,0,0,0.08)]">
          {items.map((category, index) => {
            const slug = category?.slug || ''
            const href = slug ? `/shop?category=${slug}` : '/shop'
            const img = category?.image?.secure_url || category?.image?.url

            return (
              <Link
                href={href}
                key={category?._id || index}
                className="block border-b border-r border-gray-200"
              >
                <div className="p-10 bg-white/70 backdrop-blur-sm home-category-box h-full transition-all duration-300 hover:bg-white">

                  {/* Image */}
                  <div className="mb-6">
                    <div>
                      {img ? (
                        <img
                          src={img}
                          alt={category?.name || 'category'}
                          className="w-20 h-20 rounded-full object-contain bg-white border border-grey-100"
                        />
                      ) : (
                        <LuImage size={32} className="text-gray-300" />
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4 whitespace-pre-line">
                    {category?.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    Browse products in this category.
                  </p>

                </div>
              </Link>
            )
          })}
        </div>

        {/* Button */}
        <div className="text-center">
          <Link
            href="/shop"
            className="et-black-button inline-block mt-8 border border-white px-8 py-3 text-sm uppercase tracking-widest transition duration-300"
          >
            View all
            <LuChevronRight className="inline ml-1" />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default ServicesGrid