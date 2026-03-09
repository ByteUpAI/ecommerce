
'use client'
import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu'

const ArrowNext = ({ onClick }) => (
    <button
        onClick={onClick}
        type="button"
        aria-label="Next slide"
        className="w-20 h-20 flex items-center justify-center absolute z-30 bottom-0 right-0 bg-[var(--primary)] text-white"
    >
        <LuChevronRight size={22} />
    </button>
)

const ArrowPrev = ({ onClick }) => (
    <button
        onClick={onClick}
        type="button"
        aria-label="Previous slide"
        className="w-20 h-20 flex items-center justify-center absolute z-30 bottom-0 right-20 bg-white text-black"
    >
        <LuChevronLeft size={22} />
    </button>
)

const MainSlider = React.forwardRef(({ images = [], onSlideChange }, ref) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        autoplay: true,
        autoplaySpeed: 6000,
        nextArrow: <ArrowNext />,
        prevArrow: <ArrowPrev />,
        afterChange: (idx) => {
            if (onSlideChange) onSlideChange(idx)
        },
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    nextArrow: <></>,
                    prevArrow: <></>,
                }
            }
        ]
    }

    return (
        <div className="relative min-h-[500px] sm:min-h-[600px] lg:h-[50vh] xl:h-[90vh]">
            <Slider ref={ref} {...settings} className="h-full">
                {images.map((image, index) => {
                    const src = image?.secure_url || image?.url || image?.src || ''
                    return (
                        <div key={index} className="outline-none">
                            <div className="relative min-h-[500px] sm:min-h-[600px] lg:h-[50vh] xl:h-[90vh] bg-cover bg-center w-full"
                                style={{ backgroundImage: `url('${src}')` }}
                            >
                                {/* Dark scrim + overlay texture — matching HTML exactly */}
                                <div className="absolute inset-0 bg-black/50">
                                    <img
                                        src="/assets/img/overlay_light.png"
                                        className="w-full h-full object-cover opacity-60"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
})

MainSlider.displayName = 'MainSlider'

export default MainSlider