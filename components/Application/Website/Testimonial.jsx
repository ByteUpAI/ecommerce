'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import Slider from 'react-slick'

import { useEffect } from 'react'

const CustomArrow = ({ onClick, direction }) => {

useEffect(() => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.4 })

  document.querySelectorAll('.reveal-line').forEach(el => observer.observe(el))

  return () => observer.disconnect()
}, [])
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2
        w-12 h-12
        bg-white hover:bg-primary
        text-black hover:text-white
        border border-gray-200
        shadow-sm
        flex items-center justify-center
        transition-all duration-300
        z-30
        ${direction === "left" ? "-left-16" : "-right-16"}
      `}
    >
      {direction === "left" ? (
        <LuChevronLeft size={22} />
      ) : (
        <LuChevronRight size={22} />
      )}
    </button>
  )
}


const Testimonial = () => {
  // Static testimonials as per your HTML requirement
  const staticTestimonials = [
    {
      name: 'Ananya Verma',
      review: 'The website looks modern and professional. I really liked the layout and how clearly the content is presented. It works well on my phone and laptop. A few minor improvements could enhance usability further, but overall it delivers a very reliable and pleasant experience.',
      designation: 'Customer',
    },
    {
      name: 'Amit Shah',
      review: 'Overall, this is a well-designed and user-friendly website. The navigation is straightforward, and the content is easy to understand. I did not face any bugs or loading issues. With a few small enhancements, this platform could easily become outstanding.',
      designation: 'Customer',
    },
    {
      name: 'Rahul Mehta',
      review: 'The website performs exceptionally well and feels very responsive. I appreciate how simple yet powerful the design is. There is no unnecessary clutter, and everything works as expected. It gave me confidence in the service being offered and left a very positive impression.',
      designation: 'Customer',
    },
    {
      name: 'Neha Singh',
      review: 'Overall, this is a well-designed and user-friendly website. The navigation is straightforward, and the content is easy to understand. I did not face any bugs or loading issues. With a few small enhancements, this platform could easily become outstanding.',
      designation: 'Customer',
    },
    {
      name: 'Sandeep Kumar',
      review: 'The website performs exceptionally well and feels very responsive. I appreciate how simple yet powerful the design is. There is no unnecessary clutter, and everything works as expected. It gave me confidence in the service being offered and left a very positive impression.',
      designation: 'Customer',
    },
  ]

  const settings = {
    dots: false, // Turned off to match your HTML cleaner look, set to true if needed
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  }

  return (
    <section className="py-12 md:py-18 lg:py-24 relative px-3 xl:px-0 lg:px-8">
      {/* Background Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
            src="assets/img/overlay_dark.png" 
            className="w-full h-full object-cover opacity-40" 
            alt="background overlay" 
        />
      </div>
      
      <div className="relative z-20 max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
                before:content-['']
                before:absolute
                before:left-0
                before:top-1
                before:-translate-y-1/10
                before:w-6
                before:h-80
                before:border-l-5
                before:border-[var(--primary)]">
            Testimonials
          </h2>
        </div>

        <div className="testimonial-slider">
          <Slider {...settings}>
            {staticTestimonials.map((item, index) => (
              <div key={index} className="px-3">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col h-full wow fadeInUp"
                >
                  {/* Review Box */}
                  <div className="bg-white bg-white flex-1 flex p-6 lg:p-10 testimonial-text">
                    <p className="text-gray-900 text-base mb-0">
                      {item.review}
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="flex mt-8">
                    <div className="size-18 border border-gray-300">
                      <img 
                        src="assets/img/user.png" 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + item.name }}
                      />
                    </div>
                    <div className="ps-6 pb-4">
                      <h4 className="font-bold text-xl relative reveal-line
                            before:content-['']
                            before:absolute
                            before:left-0
                            before:top-5
                            before:-translate-y-1/10
                            before:block
                            before:w-full
                            before:h-2
                            before:-z-10
                            before:bg-[var(--primary)]">
                        {item.name}
                        {/* The Primary Highlight bar under name */}
                        <span className="absolute left-0 bottom-1 w-full h-2 bg-primary/40 -z-10"></span>
                      </h4>
                      <div className="block">
                        <span className="text-lg font-semibold text-gray-400">
                            {item.designation}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default Testimonial