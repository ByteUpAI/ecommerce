'use client'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import logo from '@/public/assets/images/logo-black.png'
import userIcon from '@/public/assets/images/user.png'
import { IoIosSearch } from "react-icons/io"
import { HiMiniBars3 } from "react-icons/hi2"
import { IoMdClose } from "react-icons/io"
import { LuChevronDown, LuChevronRight } from 'react-icons/lu'
import Cart from './Cart'
import Search from './Search'
import { VscAccount } from "react-icons/vsc"
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth)
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isShopSubmenuOpen, setIsShopSubmenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = useMemo(() => ([
    { label: 'Home', href: WEBSITE_HOME, match: (path) => path === '/' },
    { label: 'Shop', href: WEBSITE_SHOP, match: (path) => path.startsWith('/shop') || path.startsWith('/product') },
    { label: 'Contact Us', href: '/contact-us', match: (path) => path.startsWith('/contact') },
  ]), [])

  const isActive = (link) => (link.match ? link.match(pathname || '') : pathname === link.href)

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="w-full mx-auto flex items-center justify-between pl-6 lg:pl-12 px-0 h-20">

        {/* LEFT: Logo + Nav */}
        <div className="flex items-center space-x-16">
          <div className="flex items-center text-4xl leading-none">
            <Link href={WEBSITE_HOME}>
              <Image src={logo} alt="Logo" width={128} height={48} className="w-32 h-auto" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10 text-[16px] text-black font-medium">
            {navLinks.map((link) => {
              const active = isActive(link)


              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[var(--primary)] after:transition-all after:duration-300 ${
                    active ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* RIGHT: Icons + CTA */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-6">

            {/* Search */}
            <button
              className="text-gray-300 hover:text-black text-lg pr-6 border-r border-gray-300"
              onClick={() => setShowSearch(!showSearch)}
            >
              <IoIosSearch />
            </button>

            {/* Cart */}
            <div className="pr-6 border-r border-gray-300">
              <Cart />
            </div>

            {/* User / Avatar */}
            <button className="text-gray-300 hover:text-black text-lg pr-6">
              {!auth ? (
                <Link href={USER_DASHBOARD}>
                  <VscAccount />
                </Link>
              ) : (
                <Link href={USER_DASHBOARD}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={auth?.image || userIcon.src} alt="user" />
                  </Avatar>
                </Link>
              )}
            </button>
          </div>

          {/* CTA Button */}
          <Link
            href={WEBSITE_LOGIN}
            className="bg-[var(--primary)] px-8 h-20 flex items-center font-semibold text-black hover:bg-black hover:text-white transition"
          >
            Login <LuChevronRight className="ml-3" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-3xl pr-6"
          onClick={() => setIsMobileMenu(true)}
        >
          <HiMiniBars3 />
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && <Search />}

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-all duration-300 z-40 ${isMobileMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenu(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#f3f3f3] transform transition-transform duration-300 z-50 flex flex-col ${
          isMobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button onClick={() => setIsMobileMenu(false)} className="text-2xl text-gray-500 hover:text-black">
            <IoMdClose />
          </button>
        </div>

        {/* Mobile Nav */}
        <nav className="px-8 text-gray-800 text-lg">
          {navLinks.map((link) => {
            const active = isActive(link)

            if (link.label === 'Shop') {
              return (
                <div key={link.href} className="border-b border-gray-300">
                  <button
                    className="w-full flex justify-between items-center py-4 transition-colors duration-300 hover:bg-[var(--primary)]"
                    onClick={() => setIsShopSubmenuOpen(!isShopSubmenuOpen)}
                  >
                    <span className="font-medium">Shop</span>
                    <LuChevronDown className={`w-4 h-4 transition-transform duration-300 ${isShopSubmenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 bg-gray-100 ${isShopSubmenuOpen ? 'max-h-40' : 'max-h-0'}`}> 
                    <Link href="/shop/shop-1" className="block py-4 border-b border-gray-200 hover:bg-gray-200" onClick={() => setIsMobileMenu(false)}>
                      Shop-1
                    </Link>
                    <Link href="/shop/shop-2" className="block py-4 hover:bg-gray-200" onClick={() => setIsMobileMenu(false)}>
                      Shop-2
                    </Link>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-4 border-b border-gray-300 ${active ? 'text-[var(--primary)] font-semibold' : ''}`}
                onClick={() => setIsMobileMenu(false)}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Search */}
        <div className="px-8 mt-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 px-4 py-3 bg-white focus:outline-none"
            />
            <span className="absolute right-4 top-3.5 text-gray-500">
              <IoIosSearch />
            </span>
          </div>
        </div>

        {/* Mobile Login CTA */}
        <div className="px-8 mt-8">
          <Link
            href={WEBSITE_LOGIN}
            className="block bg-[var(--primary)] text-center text-white py-4 font-semibold hover:bg-cyan-500 transition"
          >
            Login <LuChevronRight className="inline ml-1" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header