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
     <div className='lg:px-40 px-5 py-20'>
       <h1 className='text-xl font-semibold mb-3'>About Us</h1>
       <h2 className='text-lg font-semibold mt-5 mb-2'>Company</h2>
       <p>Air control industries is established in 2016, leading supplier of pneumatic products, industrial valves, Automation Products, hydraulic hoses, in Ahmedabad, Gujarat. We are committed to delivering quality, reliability, and value to our customers across multiple industries.</p>
       <p className='mt-3'>We are Market Leaders and provide complete solutions of all Pneumatic and valve control problems and automation technology to the customers in Gujarat region. The offered products are widely used for various purposes in various Automation Industries.</p>
       <p className='mt-3'>We have a strong application based engineering team for optimization of solution to our valuable clients. In order to store these products in safe and organized manner, we have setup a highly developed warehousing unit at Ahmedabad.</p>

       <h2 className='text-lg font-semibold mt-8 mb-2'>Why Choose Us</h2>
       <ul className='list-disc ps-10 mt-3'>
         <li><b>Multiple Brand Partnerships</b> – We collaborate with leading brands and source directly from manufacturers, ensuring our customers receive authentic, high-quality products with competitive pricing and reliable supply.</li>
         <li><b>Massive Inventory</b> – ₹5–6 crore worth of stock covering 2,000+ products for immediate availability.</li>
         <li><b>Strong Customer Base</b> – Serving 3,200 regular customers across Gujarat with trust and consistency.</li>
         <li><b>Technical Support & After-Sales Service</b> – Trained team providing expert guidance and quick issue resolution.</li>
         <li><b>Standard Operating Procedures (SOPs)</b> – For smooth order processing, dispatch, and service.</li>
         <li><b>Fast Delivery Network</b> – Safe deliveries.</li>
       </ul>

       <h2 className='text-lg font-semibold mt-8 mb-2'>Our Vision</h2>
       <p>To be the one-stop solution provider in pneumatic products and systems, building relationships that maximize business with each customer through trust, service, and long-term collaboration. We believe “Customer – Maximum Business” as the guiding principles of our growth.</p>

       <h2 className='text-lg font-semibold mt-8 mb-2'>Our Commitment</h2>
       <p>We believe in building long-term relationships through honest business practices, prompt support, and technical expertise. Whether you need a standard product or a customized solution, our team ensures you get the right product at the right time with unmatched service.</p>
     </div>
   </div>
 )
}

export default AboutUs
