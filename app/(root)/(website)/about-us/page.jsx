import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import React from 'react'

const breadcrumb = {
  title: 'About',
  links: [
    { label: 'About' },
  ]
}

const AboutUs = () => {
  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      {/* Company Section */}
      <section className="lg:pb-24 pb-12 md:pb-18 px-3 lg:px-8 xl:px-0 relative">
        <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col gap-7">
            <h2 className="md:text-6xl font-bold !text-black mt-13">
              <span className="relative inline-block">
                <span className="relative z-10 reveal-line before:content-[''] before:absolute before:left-0 before:bottom-5 before:-translate-y-1/10 before:block before:w-full before:h-4 before:-z-10 before:bg-[var(--primary)]"> About Us Company</span>
              </span>
            </h2>
            <div className="flex flex-col gap-3">
              <p className="text-lg">Air control industries is established in 2016, leading supplier of pneumatic products, industrial valves, Automation Products, hydraulic hoses, in Ahmedabad, Gujarat. We are committed to delivering quality, reliability, and value to our customers across multiple industries.</p>
              <p className="text-lg">We are Market Leaders and provide complete solutions of all Pneumatic and valve control problems and automation technology to the customers in Gujarat region. The offered products are widely used for various purposes in various Automation Industries.</p>
              <p className="text-lg">We have a strong application based engineering team for optimization of solution to our valuable clients. In order to store these products in safe and organized manner, we have setup a highly developed warehousing unit at Ahmedabad.</p>
            </div>
          </div>
        </div>
      </section>

    
      {/* Why Choose Section */}
      <section className="w-full bg-contain bg-center bg-no-repeat bg-[#212121]" style={{ backgroundImage: "url('assets/img/map_transparent_white.png')" }}>
        <div className="flex items-center w-full bg-center">
          <div className="mx-auto px-6 py-12 md:py-18 md:px-10 xl:px-14 xl:py-15 2xl:px-32 2xl:py-22 max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl w-full">
            <h1 className="font-bold why-choose-white">
              <span className="relative inline-block">
                <span className="relative z-10 reveal-line before:content-[''] before:absolute before:left-0 before:bottom-5 before:-translate-y-1/10 before:block before:w-full before:h-4 before:-z-10 before:bg-[var(--primary)]">Why choose</span>
              </span>
            </h1>
            <p className="mt-7 text-white text-2xl">We're continually working to change the way people think about and engage with our products.</p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Multiple Brand Partnerships', desc: 'We collaborate with leading brands and source directly from manufacturers, ensuring our customers receive authentic, high-quality products with competitive pricing and reliable supply.' },
                { title: 'Massive Inventory', desc: '₹5–6 crore worth of stock covering 2,000+ products for immediate availability.' },
                { title: 'Strong Customer Base', desc: 'Serving 3,200 regular customers across Gujarat with trust and consistency.' },
                { title: 'Technical Support', desc: 'Trained team providing expert guidance and quick issue resolution.' },
                { title: 'Standard Operating Procedures (SOPs)', desc: 'For smooth order processing, dispatch, and service.' },
                { title: 'Fast Delivery Network', desc: 'Safe deliveries' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-[var(--primary)] text-3xl"><i className="fa-solid fa-angle-right"></i></div>
                  <div>
                    <h4 className="font-bold text-white text-2xl">{item.title}</h4>
                    <p className="text-lg text-white mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Vision & Commitment Section */}
      <section className="py-12 md:py-18 lg:py-24 px-3 lg:px-8 xl:px-0 bg-gray-50 relative">
        <div className="absolute inset-0">
          <img src="assets/img/overlay_dark.png" className="w-full h-full" alt="img" />
        </div>
        <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-14">
            <div className="bg-white shadow p-8">
              <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
                before:content-[''] before:absolute before:left-0 before:top-1 before:-translate-y-1/10 before:w-6 before:h-80 before:border-l-5 before:border-[var(--primary)]">
                Our Vision
              </h2>
              <div className="flex flex-col gap-3 mt-7">
                <p className="text-lg">To be the one-stop solution provider in pneumatic products and systems, building relationships that maximize business with each customer through trust, service, and long-term collaboration. We believe "Customer – Maximum Business" as the guiding principles of our growth.</p>
              </div>
            </div>
            <div className="bg-white shadow p-8">
              <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
                before:content-[''] before:absolute before:left-0 before:top-1 before:-translate-y-1/10 before:w-6 before:h-80 before:border-l-5 before:border-[var(--primary)]">
                Our Commitment
              </h2>
              <div className="flex flex-col gap-3 mt-7">
                <p className="text-lg">We believe in building long-term relationships through honest business practices, prompt support, and technical expertise. Whether you need a standard product or a customized solution, our team ensures you get the right product at the right time with unmatched service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}

export default AboutUs