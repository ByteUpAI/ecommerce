import Footer from '@/components/Application/Website/Footer'
import Header from '@/components/Application/Website/Header'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/tailwind.css";
import "../../css/custom.css";
import "../../css/all.css";
import "../../css/responsive.css";
import "../../css/owl.carousel.min.css";
import "../../css/animate.css";
// import { Kumbh_Sans } from 'next/font/google'

// const kumbh = Kumbh_Sans({
//     weight: ['400', '500', '600', '700', '800'],
//     display: 'swap',
//     subsets: ['latin']
// })

const layout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default layout