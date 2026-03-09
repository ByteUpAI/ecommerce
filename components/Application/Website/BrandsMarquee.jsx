'use client'

import React from 'react'

const BrandsMarquee = ({ companies = [] }) => {
  const items = Array.isArray(companies) ? companies.filter(Boolean) : []
  if (!items.length) return null

  const duplicateFactor = items.length < 6 ? Math.ceil(12 / items.length) : 2
  const marqueeItems = Array.from({ length: duplicateFactor }, () => items).flat()

  const handleMouseMove = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14

    card.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`
    card.style.boxShadow = `0 25px 55px rgba(15, 23, 42, 0.25)`
  }

  const handleMouseLeave = (event) => {
    const card = event.currentTarget
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)'
    card.style.boxShadow = ''
  }

  return (
    <section className='brands-marquee bg-slate-50 py-14'>
      <div className='brands-marquee-track gap-10 px-12'>
        {marqueeItems.map((company, index) => {
          const tile = (
            <div className='brands-marquee-item shrink-0'>
              <div
                className='group reactive-card relative h-48 w-[360px] overflow-hidden rounded-[32px] border border-white/20 bg-white/70 text-white shadow-[0_15px_45px_rgba(15,23,42,0.15)] backdrop-blur-3xl transition-transform duration-300'
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={company.logo?.secure_url || company.logo?.url || company.logo}
                  alt={company.name || 'Brand logo'}
                  className='absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-105'
                />

                <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/0 via-slate-900/20 to-slate-900/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                <div className='pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                  <p className='text-lg font-semibold tracking-wide'>
                    {company.name || 'Brand'}
                  </p>
                  {company.description && (
                    <p className='text-sm text-slate-200/90'>
                      {company.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )

          if (company.link) {
            return (
              <a
                key={`${company?.name || 'company'}-${index}`}
                href={company.link}
                target='_blank'
                rel='noopener noreferrer'
                className='block focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100'
              >
                {tile}
              </a>
            )
          }

          return (
            <div key={`${company?.name || 'company'}-${index}`} className='block'>
              {tile}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default BrandsMarquee
