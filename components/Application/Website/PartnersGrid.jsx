// 'use client'

// import { motion } from 'framer-motion'
// import Image from 'next/image'

// import { LuPlus } from "react-icons/lu";

// const PartnersGrid = ({ companies = [] }) => {
//     // Use provided companies or fallback to placeholder grid
//     const displayCompanies = companies.length > 0 ? companies : Array(12).fill({ name: 'Brand' })

//     return (
//         <section className="py-12 md:py-18 lg:py-24 px-3 lg:px-8 xl:px-0 bg-gray-50 relative overflow-hidden">
//             <div className="absolute inset-0">
//                 <img src="/assets/img/overlay_dark.png" className="w-full h-full object-cover" alt="" aria-hidden="true" />
//             </div>
//             <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">
//                 <div className="mb-10">
//                     <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
//                         before:content-[''] before:absolute before:left-0 before:top-1 before:w-1.5 before:h-full before:bg-primary
//                     ">
//                         Our Brands
//                     </h2>
//                     <h3 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
//                         Trusted by <br /> leading brands
//                     </h3>
//                 </div>

//                 <div className="grid gap-[1px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-gray-200 bg-gray-200">
//                     {displayCompanies.map((company, index) => {
//                         const logoUrl = company?.logo?.secure_url || company?.logo?.url || '/assets/img/client_1_black.png'; // Fallback to placeholder if needed

//                         return (
//                             <div
//                                 key={index}
//                                 className="bg-white min-h-[192px] max-h-[192px] flex items-center justify-center px-8 py-4 group relative overflow-hidden cursor-pointer"
//                             >
//                                 <img
//                                     src={logoUrl}
//                                     alt={company?.name || 'brand'}
//                                     className="max-h-16 w-auto object-contain transition-all duration-300 group-hover:opacity-0 group-hover:scale-95"
//                                 />

//                                 {/* Hover content */}
//                                 <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-center">
//                                     <Image
//                                         src={logoUrl}
//                                         alt={company?.name || 'brand'}
//                                         width={160}
//                                         height={80}
//                                         className="max-h-12 w-auto object-contain invert brightness-0 grayscale transition-all duration-500"
//                                     />
//                                     <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
//                                         <LuPlus size={20} />
//                                     </div>
//                                 </div>
//                             </div>
//                         )
//                     })}
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default PartnersGrid

// 'use client'

// import { LuPlus } from "react-icons/lu";
// const clients = [
//     { black: '/assets/img/client_1_black.png', white: '/assets/img/client_1_white.png', name: 'air control' },
//     { black: '/assets/img/client_3_black.png', white: '/assets/img/client_3_white.png', name: 'air control' },
//     { black: '/assets/img/client_4_black.png', white: '/assets/img/client_4_white.png', name: 'air control' },
//     { black: '/assets/img/client_5_black-1.png', white: '/assets/img/client_5_white.png', name: 'air control' },
//     { black: '/assets/img/client_6_black.png', white: '/assets/img/client_6_white.png', name: 'air control' },
//     { black: '/assets/img/client_7_black.png', white: '/assets/img/client_7_white.png', name: 'air control' },
//     { black: '/assets/img/client_1_black.png', white: '/assets/img/client_1_white.png', name: 'air control' },
//     { black: '/assets/img/client_3_black.png', white: '/assets/img/client_3_white.png', name: 'air control' },
//     { black: '/assets/img/client_4_black.png', white: '/assets/img/client_4_white.png', name: 'air control' },
//     { black: '/assets/img/client_5_black-1.png', white: '/assets/img/client_5_white.png', name: 'air control' },
//     { black: '/assets/img/client_6_black.png', white: '/assets/img/client_6_white.png', name: 'air control' },
//     { black: '/assets/img/client_7_black.png', white: '/assets/img/client_7_white.png', name: 'air control' },
// ]

// const PartnersGrid = ({ companies = [] }) => {
//     return (
//         <section className="py-12 md:py-18 lg:py-24 px-3 lg:px-8 xl:px-0 bg-gray-50 relative">
//             <div className="absolute inset-0">
//                 <img src="/assets/img/overlay_dark.png" className="w-full h-full" alt="img" />
//             </div>
//             <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
//                 <div>
//                     <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
//                         before:content-['']
//                         before:absolute
//                         before:left-0
//                         before:top-1
//                         before:-translate-y-1/10
//                         before:w-6
//                         before:h-80
//                         before:border-l-5
//                         before:border-[var(--primary)]">Our Brands</h2>
//                     <h3 className="text-5xl lg:text-7xl font-extrabold mb-8">Trusted by <br /> leading brands</h3>
//                 </div>

//                 <div className="brand-grid grid gap-[1px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-gray-200 bg-gray-200 wow fadeInUp">
//                     {clients.map((client, index) => (
//                         <div
//                             key={index}
//                             className="bg-white min-h-48 max-h-48 flex items-center justify-center px-8 py-4 group relative"
//                         >
//                             <img src={client.black} alt={client.name} className="group-hover:hidden" />
//                             <img src={client.white} alt={client.name} className="hidden group-hover:block relative z-10" />
//                                 <div className="plus absolute z-20 text-[var(--black)]">
//                                     <LuPlus size={20} />

//                                 </div>
//                             <div className="hiiden-bg" ></div>
//                         </div>
//                     ))}
                   
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default PartnersGrid




'use client'
import Image from 'next/image'
import { LuPlus } from "react-icons/lu";

const PartnersGrid = ({ companies = [] }) => {
    const displayCompanies = companies.length > 0 ? companies : Array(12).fill({ name: 'Brand' })

    return (
        
        <section className="py-12 md:py-18 lg:py-24 px-3 lg:px-8 xl:px-0 bg-gray-50 relative">
            <div className="absolute inset-0">
                <img src="/assets/img/overlay_dark.png" className="w-full h-full" alt="img" />
            </div>
            <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
                <div>
                    <h2 className="text-sm font-bold relative ps-4 uppercase overflow-hidden tracking-wider mb-6 py-2
                        before:content-['']
                        before:absolute
                        before:left-0
                        before:top-1
                        before:-translate-y-1/10
                        before:w-6
                        before:h-80
                        before:border-l-5
                        before:border-[var(--primary)]">Our Brands</h2>
                    <h3 className="text-5xl lg:text-7xl font-extrabold mb-8">Trusted by <br /> leading brands</h3>
                </div>

                <div className="brand-grid grid gap-[1px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-gray-200 bg-gray-200 wow fadeInUp">
                    {/* {clients.map((client, index) => (
                        <div
                            key={index}
                            className="bg-white min-h-48 max-h-48 flex items-center justify-center px-8 py-4 group relative"
                        >
                            <img src={client.black} alt={client.name} className="group-hover:hidden" />
                            <img src={client.white} alt={client.name} className="hidden group-hover:block relative z-10" />
                                <div className="plus absolute z-20 text-[var(--black)]">
                                    <LuPlus size={20} />

                                </div>
                            <div className="hiiden-bg" ></div>
                        </div>
                    ))} */}
                    {displayCompanies.map((company, index) => {
                        const logoUrl = company?.logo?.secure_url || company?.logo?.url || '/assets/img/client_1_black.png'; // Fallback to placeholder if needed

                        return (
                            <div
                                key={index}
                                className="bg-white min-h-48 max-h-48 flex items-center justify-center px-8 py-4 group relative"
                            >
                                <img
                                    src={logoUrl}
                                    alt={company?.name || 'brand'}
                                    className="group-hover:hidden"
                                />

                                {/* Hover content */}
                                    <Image
                                        src={logoUrl}
                                        alt={company?.name || 'brand'}
                                        width={160}
                                        height={80}
                                        className="hidden group-hover:block relative z-10"
                                    />
                                    <div className="plus absolute z-20 text-[var(--black)]">
                                        <LuPlus size={20} />
                                    </div>
                                    <div className="hiiden-bg"></div>
                            </div>
                        )
                    })}
                    

                </div>
            </div>
        </section>
    )
}

export default PartnersGrid

