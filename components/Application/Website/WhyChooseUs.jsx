'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaAngleRight } from 'react-icons/fa'

const features = [
  {
    title: "Multiple Brand Partnerships",
    description:
      "We collaborate with leading brands ensuring authentic, high-quality products with competitive pricing."
  },
  {
    title: "Massive Inventory",
    description:
      "₹5–6 crore worth of stock covering 2,000+ products for immediate availability."
  },
  {
    title: "Strong Customer Base",
    description:
      "Serving 3,200 regular customers across Gujarat with trust and consistency."
  },
  {
    title: "Technical Support",
    description:
      "Trained team providing expert guidance and quick issue resolution."
  }
]

const WhyChooseUs = () => {

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
    <section
      className="w-full bg-contain bg-center bg-gray-100 bg-no-repeat"
      style={{ backgroundImage: "url('/assets/img/map_transparent_dark.png')" }}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="parallax-wrapper relative md:h-[640px] lg:h-[300px] lg:h-auto overflow-hidden">
          <div
            className="parallax-bg absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/img/industrial.jpg')" }}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex items-center w-full bg-center">
          <div className="mx-auto px-6 py-6 md:py-18 md:px-10 xl:px-14 xl:py-15 2xl:px-32 2xl:py-22">

            {/* Heading */}
            <h1 className="font-bold why-choose-ex">
              Why choose{' '}
              <span className="relative inline-block">
                <span
                  className="relative z-10 reveal-line
                    before:content-['']
                    before:absolute
                    before:left-0
                    before:bottom-5
                    before:block
                    before:w-full
                    before:h-4
                    before:-z-10
                    before:bg-[var(--primary)]"
                >
                  Air Control
                </span>
              </span>
            </h1>

            {/* Paragraph */}
            <p className="mt-7 text-gray-600 text-2xl">
              We&apos;re continually working to change the way people think about and engage with our products.
            </p>

            {/* Features */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="text-[var(--primary)] text-3xl shrink-0">
                    <FaAngleRight className="mt-1" />
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-2xl">
                      {feature.title}
                    </h4>
                    <p className="text-lg text-gray-600 mt-2 line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default WhyChooseUs
