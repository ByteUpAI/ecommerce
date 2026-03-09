'use client'

import Image from 'next/image'
import Link from 'next/link'
import banner1 from '@/public/assets/images/banner1.png'
import banner2 from '@/public/assets/images/banner2.png'


const BannerImages = ({ images = [] }) => {
  const imagesToShow = images.length > 0
    ? images
    : [
        { src: banner1.src, width: banner1.width, height: banner1.height, alt: 'banner 1', link: '', isStatic: true },
        { src: banner2.src, width: banner2.width, height: banner2.height, alt: 'banner 2', link: '', isStatic: true },
      ]
  

  return (
    <section className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
      <div className='grid grid-cols-2 sm:gap-10 gap-2'>
        {imagesToShow.map((image, index) => (
          <div key={index} className='border rounded-lg overflow-hidden'>
            <Link href={image.link || '#'} className='block'>
              {image.secure_url ? (
                <img
                  src={image.secure_url}
                  alt={image.alt || `Banner ${index + 1}`}
                  className='w-full h-auto transition-all hover:scale-110'
                />
              ) : image.isStatic ? (
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  className='transition-all hover:scale-110'
                />
              ) : (
                <Image
                  src={image.src}
                  width={image.width || 400}
                  height={image.height || 300}
                  alt={image.alt || `Banner ${index + 1}`}
                  className='transition-all hover:scale-110'
                />
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BannerImages
