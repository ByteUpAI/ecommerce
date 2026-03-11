'use client'
import React, { useState, useRef, useEffect } from 'react'
import { sortings } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Link from 'next/link'

const Sorting = ({ limit, setLimit, sorting, setSorting, mobileFilterOpen, setMobileFilterOpen, totalProducts }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const selectedLabel = sortings.find(o => o.value === sorting)?.label || 'Default Sorting'

    const hasFilters = searchParams.size > 0

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const urlSearchParams = new URLSearchParams(searchParams.toString())
            const val = e.target.value.trim()
            if (val) {
                urlSearchParams.set('q', val)
            } else {
                urlSearchParams.delete('q')
            }
            router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
        }
    }

    return (
        <div className="mb-7 md:mb-14">

            {/* Mobile filter button */}
            <div className="lg:hidden mb-3">
                <button
                    type="button"
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="bg-[var(--primary)] text-black px-6 py-3 font-semibold "
                >
                    Filter
                </button>
            </div>

            {/* Single row: Search | Sorting dropdown | Results count */}
            <div className="flex flex-wrap items-center gap-3">

                {/* Search input */}
                <div className="flex items-center border border-[var(--input-border)] focus-within:ring-1 focus-within:ring-[var(--input-focus)] transition">
                    <input
                        type="search"
                        placeholder="Search products..."
                        className="text-base ps-[var(--input-x-padding)] py-[var(--input-y-padding)] outline-none bg-transparent"
                        onKeyDown={handleSearch}
                        defaultValue={searchParams.get('q') || ''}
                    />
                    <i className="fa-solid fa-magnifying-glass pe-[var(--input-x-padding)] text-[var(--text-gray)]" />
                </div>

                {/* Sorting dropdown */}
                <div ref={dropdownRef} className="relative w-52">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="flex justify-between w-full px-[var(--input-x-padding)] py-[var(--input-y-padding)]
                            text-left bg-white border border-[var(--input-border)] items-center"
                    >
                        <span>{selectedLabel}</span>
                        <i className={`fa-solid fa-chevron-down transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-white shadow rounded z-50">
                            {sortings.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        setSorting(option.value)
                                        setDropdownOpen(false)
                                    }}
                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${sorting === option.value ? 'text-[var(--primary)] font-semibold' : ''}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results count — pushed to the right */}
                <div className="ml-auto flex items-center gap-4">
                    {/* {hasFilters && (
                        <Link
                            href={WEBSITE_SHOP}
                            className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--primary)] hover:text-black transition-colors rounded shadow-sm"
                        >
                            Clear All Filters
                        </Link>
                    )} */}
                    <p className="text-[var(--text-gray)]">
                        Showing {totalProducts ?? ''} result{totalProducts !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Sorting
