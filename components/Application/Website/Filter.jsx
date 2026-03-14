'use client'
import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// ── Individual accordion group ──
const FilterAccordion = ({ label, children }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative inline-block w-full">
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="px-4 py-4 relative z-10 w-full bg-white shadow text-lg font-bold hover:text-[var(--primary)] text-left text-black rounded flex justify-between items-center"
            >
                {label}
                <i className={`fa-solid fa-chevron-right transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
            </button>
            <div
                className={`overflow-hidden relative transition-all duration-300 ease-in-out ps-5 w-full bg-white
                    before:content-[''] before:absolute before:left-5 before:border-l-2
                    before:border-[var(--input-border)] before:block before:w-full before:h-full
                    before:pointer-events-none before:z-0
                    ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {children}
            </div>
        </div>
    )
}

// ── Checkbox label row ──
const FilterCheckbox = ({ label, checked, onChange, isFirst, isLast }) => (
    <label
        className={`flex items-center gap-3 px-4 py-2 text-lg font-normal relative z-10 hover:text-[var(--primary)] cursor-pointer
            ${isFirst ? 'pt-6' : ''} ${isLast ? 'pb-6' : ''}`}
    >
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-5 h-5 min-w-5 min-h-5 accent-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
        />
        <span>{label}</span>
    </label>
)

// ── Section heading (styled like PHP) ──
const SectionHeading = ({ children }) => (
    <h2 className="text-xl font-bold text-black relative mb-4
        before:content-[''] before:absolute before:left-0 before:-bottom-2 before:-translate-y-1/2
        before:w-6 before:h-2 before:border-b-2 before:border-[var(--primary)]
        after:content-[''] after:absolute after:left-7 after:-bottom-2 after:-translate-y-1/2
        after:w-10 after:h-2 after:border-b-2 after:border-[var(--text-light)]">
        {children}
    </h2>
)
const PriceRange = ({ onApply, initialMin = 0, initialMax = 100000 }) => {
    const max = 100000

    const [minVal, setMinVal] = useState(initialMin)
    const [maxVal, setMaxVal] = useState(initialMax)

    // 🔥 Sync with URL when it changes
    useEffect(() => {
        setMinVal(initialMin)
        setMaxVal(initialMax)
    }, [initialMin, initialMax])

    const formatINR = (num) => new Intl.NumberFormat('en-IN').format(num)

    const leftPct = (minVal / max) * 100
    const widthPct = ((maxVal - minVal) / max) * 100

    return (
        <div>
            <SectionHeading>Filter by price</SectionHeading>

            <div className="w-full space-y-5 mt-5">
                <div className="relative h-6">

                    {/* Track */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-300 rounded" />

                    {/* Active fill */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-1 bg-[var(--primary)] rounded"
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    />

                    {/* Min thumb */}
                    <input
                        type="range"
                        min={0}
                        max={max}
                        step={1000}
                        value={minVal}
                        onChange={(e) => {
                            const val = Math.min(Number(e.target.value), maxVal - 1000)
                            setMinVal(val)
                        }}
                        className="range-input absolute top-1/2 -translate-y-1/2"
                    />

                    {/* Max thumb */}
                    <input
                        type="range"
                        min={0}
                        max={max}
                        step={1000}
                        value={maxVal}
                        onChange={(e) => {
                            const val = Math.max(Number(e.target.value), minVal + 1000)
                            setMaxVal(val)
                        }}
                        className="range-input absolute top-1/2 -translate-y-1/2"
                    />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => onApply(minVal, maxVal)}
                        className="bg-[var(--primary)] hover:bg-black hover:text-white px-4 py-2 font-semibold transition-colors duration-200"
                    >
                        Filter
                    </button>

                    <p className="price-text text-sm">
                        Price: ₹{formatINR(minVal)} — ₹{formatINR(maxVal)}
                    </p>
                </div>
            </div>
        </div>
    )
}

// ── Main Filter component — all original dynamic logic kept ──
const Filter = ({ onClose }) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const urlSearchParams = new URLSearchParams(searchParams.toString())

    const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 100000 })
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedAttributes, setSelectedAttributes] = useState({})

    const { data: categoryData, loading: categoryLoading } = useFetch('/api/category/get-category')

    // Fetch attributes based on selected categories
    const attributesUrl = selectedCategory.length > 0
        ? `/api/product-variant/attributes?category=${selectedCategory.join(',')}`
        : '/api/product-variant/attributes'
    const { data: attributesData, loading: attributesLoading } = useFetch(attributesUrl)

    useEffect(() => {
        if (searchParams.get('category')) {
            setSelectedCategory(searchParams.get('category').split(','))
        } else {
            setSelectedCategory([])
        }

        const attrs = {}
        for (const [key, value] of searchParams.entries()) {
            if (key.startsWith('attr_')) {
                const attrKey = key.replace('attr_', '')
                attrs[attrKey] = value.split(',')
            }
        }
        setSelectedAttributes(attrs)
    }, [searchParams])

    const handleCategoryFilter = (categorySlug) => {
        let newSelectedCategory = [...selectedCategory]
        if (newSelectedCategory.includes(categorySlug)) {
            newSelectedCategory = newSelectedCategory.filter(cat => cat !== categorySlug)
        } else {
            newSelectedCategory.push(categorySlug)
        }
        setSelectedCategory(newSelectedCategory)
        if (newSelectedCategory.length > 0) {
            urlSearchParams.set('category', newSelectedCategory.join(','))
        } else {
            urlSearchParams.delete('category')
        }
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handleAttributeFilter = (attrKey, attrValue) => {
        const newSelectedAttributes = { ...selectedAttributes }
        if (!newSelectedAttributes[attrKey]) newSelectedAttributes[attrKey] = []

        if (newSelectedAttributes[attrKey].includes(attrValue)) {
            newSelectedAttributes[attrKey] = newSelectedAttributes[attrKey].filter(v => v !== attrValue)
            if (newSelectedAttributes[attrKey].length === 0) delete newSelectedAttributes[attrKey]
        } else {
            newSelectedAttributes[attrKey].push(attrValue)
        }
        setSelectedAttributes(newSelectedAttributes)

        Object.entries(newSelectedAttributes).forEach(([key, values]) => {
            if (values.length > 0) {
                urlSearchParams.set(`attr_${key}`, values.join(','))
            } else {
                urlSearchParams.delete(`attr_${key}`)
            }
        })

        for (const [key] of urlSearchParams.entries()) {
            if (key.startsWith('attr_')) {
                const k = key.replace('attr_', '')
                if (!newSelectedAttributes[k]) urlSearchParams.delete(key)
            }
        }

        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handlePriceFilter = (minPrice, maxPrice) => {
        urlSearchParams.set('minPrice', minPrice)
        urlSearchParams.set('maxPrice', maxPrice)
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    return (
        <div>
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-end mb-4">
                <button type="button" onClick={onClose} className="cursor-pointer">
                    <i className="fa-solid fa-xmark text-xl" />
                </button>
            </div>

            <div className="flex flex-col gap-y-6 md:gap-y-8 lg:mt-10">

                {/* Clear All Filters button at top of filter */}
                {searchParams.size > 0 && (
                    <div>
                        <Button type="button" variant="destructive" className="w-full mb-6" asChild>
                            <Link href={WEBSITE_SHOP}>Clear All Filters</Link>
                        </Button>

                    </div>
                )}

                {/* Attribute accordions */}
                <div>
                    <div className="mb-0">
                        <SectionHeading>Filter</SectionHeading>
                    </div>
                    <div className="flex flex-col">

                        {/* Category accordion */}
                        <FilterAccordion label="Category">
                            {categoryLoading && <div className="p-4 text-sm text-[var(--text-gray)] italic">Loading...</div>}
                            {categoryData?.success && categoryData.data.length > 0 ? categoryData.data.map((category, i) => (
                                <FilterCheckbox
                                    key={category._id}
                                    label={category.name}
                                    checked={selectedCategory.includes(category.slug)}
                                    onChange={() => handleCategoryFilter(category.slug)}
                                    isFirst={i === 0}
                                    isLast={i === categoryData.data.length - 1}
                                />
                            )) : !categoryLoading && <div className="p-4 text-sm text-[var(--text-gray)] italic">No categories found</div>}
                        </FilterAccordion>

                        {/* Dynamic attribute accordions */}
                        {attributesLoading && <div className="p-4 text-sm text-[var(--text-gray)] italic px-4">Loading filters...</div>}
                        {attributesData?.success && attributesData.data.map((attribute) => (
                            <FilterAccordion key={attribute.key} label={attribute.label}>
                                {attribute.values.map((value, i) => (
                                    <FilterCheckbox
                                        key={value}
                                        label={value}
                                        checked={selectedAttributes[attribute.key]?.includes(value) || false}
                                        onChange={() => handleAttributeFilter(attribute.key, value)}
                                        isFirst={i === 0}
                                        isLast={i === attribute.values.length - 1}
                                    />
                                ))}
                            </FilterAccordion>
                        ))}

                    </div>
                </div>

                {/* Price range */}
                <PriceRange
                    onApply={handlePriceFilter}
                    initialMin={Number(searchParams.get('minPrice')) || 0}
                    initialMax={Number(searchParams.get('maxPrice')) || 100000}
                />

            </div>
        </div>
    )
}

export default Filter
