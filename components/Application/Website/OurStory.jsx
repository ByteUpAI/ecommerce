'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Counter animation hook
const useCounter = (target, duration = 2000) => {
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = 0
            const increment = target / (duration / 16)
            let current = start

            const timer = setInterval(() => {
              current += increment
              if (current >= target) {
                current = target
                clearInterval(timer)
              }
              el.textContent = Math.floor(current).toLocaleString()
            }, 16)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return ref
}

// Reveal line hook
const useRevealLine = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

// Counter Component
const Counter = ({ target, suffix = '' }) => {
  const ref = useCounter(target)
  return (
    <span ref={ref} className="counter">
      0
    </span>
  )
}

// Progress Ring Circle
const ProgressRing = ({ children, size = 'lg' }) => {
  const sizeClasses = {
    lg: 'w-74 h-74 md:w-74 md:h-74 lg:w-74 lg:h-74 2xl:w-74 2xl:h-74',
    md: 'w-58 h-58 md:w-58 md:h-58 lg:w-58 lg:h-58 2xl:w-58 2xl:h-58',
    sm: 'w-48 h-48 md:w-48 md:h-48 lg:w-48 lg:h-48 2xl:w-48 2xl:h-48',
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${sizeClasses[size]} progress-ring`}
    >
      <div className="moving">
        <div className="yellow-line"></div>
      </div>
      {children}
    </div>
  )
}

// Stat Item
const StatItem = ({ value, label }) => (
  <div className="flex items-center">
    <div className="text-2xl border border-4 rounded-full text-[var(--primary)] border-[var(--primary)] size-12 flex items-center justify-center">
      <i className="fa-solid fa-chevron-right"></i>
    </div>
    <div className="ps-6">
      <p className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  </div>
)

const OurStory = () => {
  const revealRef = useRevealLine()
  const counter616Ref = useCounter(616)
  const counter203Ref = useCounter(203)
  const counter2713Ref = useCounter(2713)

  return (
    <section
      className="py-12 md:py-18 lg:py-24 px-3 md:px-24 xl:px-0 bg-center bg-no-repeat bg-contain relative"
      style={{ backgroundImage: "url('assets/img/map_transparent_dark.png')" }}
    >
      {/* Gradients */}
      <div className="top-gradient gradient"></div>
      <div className="bottom-gradient gradient"></div>

      {/* Overlay */}
      <div className="absolute inset-0">
        <img src="assets/img/overlay_dark.png" className="w-full h-full" alt="img" />
      </div>

      <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl md:px-32 xl:px-0 mx-auto relative z-10">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-extrabold number-text lg:w-94 xl:w-96">
              <span className="relative inline-block">
                <span
                  ref={revealRef}
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
                    before:bg-[var(--primary)]
                    before:scale-x-0
                    before:origin-left
                    before:transition-transform
                    before:duration-500
                    [&.show]:before:scale-x-100"
                >
                  2019
                </span>
              </span>
              {' '}Number
            </h2>

            <div className="mt-8">
              <p className="text-2xl">
                A new story is beginning with a new vision for the future, an expertise across the
                entire industry cycle and the ambition to give energy its full value
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-8 gap-y-6 gap-x-3">
              <StatItem value="351M Sales <br/> generated" label="" />
              <StatItem value="16K New clients <br/> joined us" label="" />
              <StatItem value="12% Market share <br/> increase" label="" />
              <StatItem value="200T Resources <br/> produced" label="" />
            </div>
          </motion.div>

          {/* Right Column - Circles */}
          <motion.div
            id="parallax-container"
            className="relative flex flex-col xl:flex-row"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Left Round - Large Circle */}
            <div className="left-round">
              <div
                className="relative flex items-center justify-center w-full h-80 md:h-full transition-transform duration-200 ease-out"
                data-speed="2"
              >
                <ProgressRing size="lg">
                  <div className="flex">
                    <span
                      ref={counter616Ref}
                      className="text-72 font-bold text-[var(--primary)] counter"
                    >
                      0
                    </span>
                    <span className="text-72 font-bold text-[var(--primary)]">K</span>
                  </div>
                  <span className="text-lg font-semibold font-medium">Projects completed</span>
                </ProgressRing>
              </div>
            </div>

            {/* Right Round - Two Smaller Circles */}
            <div className="right-round">
              {/* Countries */}
              <div
                className="relative flex items-center justify-center w-full h-54 md:h-54 lg:h-auto transition-transform duration-200 ease-out"
                data-speed="3"
              >
                <ProgressRing size="sm">
                  <span
                    ref={counter203Ref}
                    className="text-52 font-bold text-[var(--primary)] counter"
                  >
                    0
                  </span>
                  <span className="text-lg md:text-lg lg:text-base xl:text-lg font-semibold font-medium">
                    Countries
                  </span>
                </ProgressRing>
              </div>

              {/* New Talents */}
              <div
                className="relative flex items-center justify-center w-full h-60 md:h-60 lg:h-auto md:-ml-5 lg:-ml-2 transition-transform duration-200 ease-out"
                data-speed="4"
              >
                <ProgressRing size="md">
                  <span
                    ref={counter2713Ref}
                    className="text-52 font-bold text-[var(--primary)] counter"
                  >
                    0
                  </span>
                  <span className="text-lg md:text-lg lg:text-base xl:text-lg font-semibold">
                    New talents hired
                  </span>
                </ProgressRing>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default OurStory