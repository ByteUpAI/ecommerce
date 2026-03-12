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
     <section className='px-3 lg:px-8 xl:px-0 py-12 md:py-18 lg:py-24'>
       <div className='max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto'>
         <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
           <div className='lg:col-span-7'>
             <div className='bg-white shadow-box border border-gray-100 p-6 md:p-10'>
               <h1 className='text-3xl md:text-4xl font-bold mb-4'>About Us</h1>
               <p className='text-[var(--text-light)] leading-7'>Air control industries is established in 2016, leading supplier of pneumatic products, industrial valves, Automation Products, hydraulic hoses, in Ahmedabad, Gujarat. We are committed to delivering quality, reliability, and value to our customers across multiple industries.</p>
               <p className='text-[var(--text-light)] leading-7 mt-4'>We are Market Leaders and provide complete solutions of all Pneumatic and valve control problems and automation technology to the customers in Gujarat region. The offered products are widely used for various purposes in various Automation Industries.</p>
               <p className='text-[var(--text-light)] leading-7 mt-4'>We have a strong application based engineering team for optimization of solution to our valuable clients. In order to store these products in safe and organized manner, we have setup a highly developed warehousing unit at Ahmedabad.</p>
             </div>
           </div>

           <div className='lg:col-span-5'>
             <div className='bg-white shadow-box border border-gray-100 p-6 md:p-10'>
               <h2 className='text-2xl font-bold mb-4'>Why Choose Us</h2>
               <ul className='space-y-3 text-[var(--text-light)] leading-7'>
                 <li><b className='text-black'>Multiple Brand Partnerships</b> – We collaborate with leading brands and source directly from manufacturers, ensuring our customers receive authentic, high-quality products with competitive pricing and reliable supply.</li>
                 <li><b className='text-black'>Massive Inventory</b> – ₹5–6 crore worth of stock covering 2,000+ products for immediate availability.</li>
                 <li><b className='text-black'>Strong Customer Base</b> – Serving 3,200 regular customers across Gujarat with trust and consistency.</li>
                 <li><b className='text-black'>Technical Support & After-Sales Service</b> – Trained team providing expert guidance and quick issue resolution.</li>
                 <li><b className='text-black'>Standard Operating Procedures (SOPs)</b> – For smooth order processing, dispatch, and service.</li>
                 <li><b className='text-black'>Fast Delivery Network</b> – Safe deliveries.</li>
               </ul>
             </div>
           </div>
         </div>

         <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10'>
           <div className='bg-white shadow-box border border-gray-100 p-6 md:p-10'>
             <h2 className='text-2xl font-bold mb-3'>Our Vision</h2>
             <p className='text-[var(--text-light)] leading-7'>To be the one-stop solution provider in pneumatic products and systems, building relationships that maximize business with each customer through trust, service, and long-term collaboration. We believe “Customer – Maximum Business” as the guiding principles of our growth.</p>
           </div>
           <div className='bg-white shadow-box border border-gray-100 p-6 md:p-10'>
             <h2 className='text-2xl font-bold mb-3'>Our Commitment</h2>
             <p className='text-[var(--text-light)] leading-7'>We believe in building long-term relationships through honest business practices, prompt support, and technical expertise. Whether you need a standard product or a customized solution, our team ensures you get the right product at the right time with unmatched service.</p>
           </div>
         </div>
       </div>
     </section>
   </div>
 )
}

export default AboutUs
