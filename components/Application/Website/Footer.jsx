import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/assets/images/logo-black.png'
import { WEBSITE_HOME, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { FALLBACK_CONTACT_INFO, splitPhones } from '@/lib/contactInfo'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { MdLocationOn, MdPhone } from 'react-icons/md'
import { FaChevronRight } from 'react-icons/fa'

const linkCols = [
    {
        title: 'Company',
        links: [
            { label: 'Our Journey', href: '/about-us' },
            { label: 'Shop', href: WEBSITE_SHOP },
        ],
    },
    {
        title: 'Useful Links',
        links: [
            { label: 'Home', href: WEBSITE_HOME },
            { label: 'Shop', href: WEBSITE_SHOP },
            { label: 'About', href: '/about-us' },
            { label: 'Register', href: '/register' },
            { label: 'Login', href: '/login' },
        ],
    },
    {
        title: 'Help Center',
        links: [
            { label: 'Register', href: '/register' },
            { label: 'Login', href: '/login' },
            { label: 'My Account', href: '/user/dashboard' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '/terms-conditions' },
        ],
    },
]

const headingClass = `text-white font-semibold mb-4 text-lg relative
    before:content-['']
    before:absolute
    before:left-0
    before:-bottom-2
    before:-translate-y-1/2
    before:w-6
    before:h-2
    before:border-b-2
    before:border-[var(--primary)]
    after:content-['']
    after:absolute
    after:left-7
    after:-bottom-2
    after:-translate-y-1/2
    after:w-10
    after:h-2
    after:border-b-2
    after:border-white`

const Footer = () => {
    const info = FALLBACK_CONTACT_INFO
    const phones = splitPhones(info.phone)

    return (
        <footer>
            {/* Main Footer */}
            <div className="mx-auto">
                <div className="gird gird-cols-1 lg:flex">

                    {/* Left Section */}
                    <div
                        className="w-full lg:basis-[40%] mb-10 footer-left"
                        style={{ backgroundImage: "url('/assets/img/map_white.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }}
                    >
                        <div className="mb-4">
                            <Image src={logo} alt="Footer Logo" width={128} height={50} className="footer-logo w-32" />
                        </div>

                        <p className="mb-2 text-sm leading-relaxed">
                            Air Control Industries, established in 2016 in Ahmedabad, Gujarat, is a leading supplier of pneumatic products, industrial valves, automation products, and hydraulic hoses. We deliver quality, reliability, and value with strong technical support and dependable service.
                        </p>
                 <button className="et-slider-button inline-block mt-3 border border-white px-8 py-3 text-sm uppercase tracking-widest transition duration-300 flex items-center gap-2">
                        Find Location
                   <i className="fa-solid fa-chevron-right text-sm"></i>
                    </button>
                    </div>

                    {/* Right Section */}
                    <div className="w-full lg:basis-[60%] mb-10 footer-right">
                        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-8">

                            {/* Link Columns */}
                            {linkCols.map((col) => (
                                <div key={col.title}>
                                    <h5 className={headingClass}>{col.title}</h5>
                                    <ul className="space-y-2 text-sm">
                                        {col.links.map((link) => (
                                            <li key={link.label}>
                                                <Link href={link.href} className="text-gray-300 hover:text-white text-base">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* Contact Us */}
                            <div>
                                <h5 className={headingClass}>Contact Us</h5>
                                <ul className="space-y-4 text-sm">
                                    <li className="flex gap-3">
                                        <MdLocationOn className="mt-1 flex-shrink-0" size={16} />
                                        <div className="leading-6">
                                            {info.addressLine1}, {info.addressLine2},<br />
                                            {info.city} {info.state} {info.pincode}, {info.country}
                                        </div>
                                    </li>
                                    {phones.map((phone, idx) => (
                                        <li key={idx}>
                                            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex gap-3 hover:text-white">
                                                <MdPhone size={16} />
                                                <div>{phone}</div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom mt-4">
                <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

                    <div className="footer-bottom-left text-base text-gray-400">
                        © 2024 Air Control Industries. All Rights Reserved.
                    </div>

                    <div className="flex gap-6 footer-bottom-right">
                        <a href="#" className="text-gray-400 hover:text-white size-9 text-xl flex justify-center items-center"><FaFacebookF /></a>
                        <a href="#" className="text-gray-400 hover:text-white size-9 text-xl flex justify-center items-center"><FaInstagram /></a>
                        <a href="#" className="text-gray-400 hover:text-white size-9 text-xl flex justify-center items-center"><FaLinkedinIn /></a>
                        <a href="#" className="text-gray-400 hover:text-white size-9 text-xl flex justify-center items-center"><FaYoutube /></a>
                        <a href="#" className="text-gray-400 hover:text-white size-9 text-xl flex justify-center items-center"><FaXTwitter /></a>
                    </div>

                </div>
            </div>
        </footer>
    )
}

export default Footer