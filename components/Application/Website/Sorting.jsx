'use client'
import React, { useState, useRef, useEffect } from 'react'
import { sortings } from '@/lib/utils'

const Sorting = ({ limit, setLimit, sorting, setSorting, mobileFilterOpen, setMobileFilterOpen, totalProducts }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const selectedLabel = sortings.find(o => o.value === sorting)?.label || 'Default Sorting'

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-7 md:mb-14">

            {/* Mobile: Filter button */}
            <div className="lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="bg-[var(--primary)] text-black px-6 py-3 font-semibold"
                >
                    Filter
                </button>
            </div>

            {/* Sorting dropdown — PHP style */}
            <div ref={dropdownRef} className="relative w-60">
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

            {/* Results count */}
            <div>
                <p className="text-[var(--text-gray)]">
                    Showing {totalProducts ?? ''} result{totalProducts !== 1 ? 's' : ''}
                </p>
            </div>
        </div>
    )
}

export default Sorting