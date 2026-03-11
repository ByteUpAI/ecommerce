'use client'

import { IoStar } from "react-icons/io5";
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useCallback, useState } from "react"
import { useRouter } from 'next/navigation'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { decode } from "entities";
import { HiMinus, HiPlus } from "react-icons/hi2";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import loadingSvg from '@/public/assets/images/loading.svg'
import { marked } from 'marked'

const ProductDetails = ({ product, variant, attributeOptions, variants, selectedAttributes, reviewCount }) => {

    const router = useRouter()
    const dispatch = useDispatch()
    const cartStore = useSelector(store => store.cartStore)

    const [activeThumb, setActiveThumb] = useState()

    const [qty, setQty] = useState(1)
    const [isAddedIntoCart, setIsAddedIntoCart] = useState(false)
    const [isProductLoading, setIsProductLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('description')

    const displayMedia = useMemo(() => {
        const variantMedia = Array.isArray(variant?.media) ? variant.media : []
        if (variantMedia.length > 0) return variantMedia
        const productMedia = Array.isArray(product?.media) ? product.media : []
        return productMedia
    }, [variant?.media, product?.media])

    const descriptionHtml = useMemo(() => {
        const raw = decode(product?.description || '')
        if (!raw) return ''
        if (raw.includes('<')) return raw
        return marked.parse(raw)
    }, [product?.description])

    const getAttrValue = useCallback((attrs, key) => {
        if (!attrs) return undefined
        if (typeof attrs.get === 'function') return attrs.get(key)
        return attrs?.[key]
    }, [])

    const selection = useMemo(() => {
        const sel = {}
        if (product?.variantConfig?.attributes && Array.isArray(product.variantConfig.attributes)) {
            product.variantConfig.attributes.forEach((attr) => {
                const v = getAttrValue(variant?.attributes, attr.key) || selectedAttributes?.[attr.key]
                if (v !== undefined && v !== null && String(v).length) {
                    sel[attr.key] = String(v)
                }
            })
        }
        return sel
    }, [product?.variantConfig?.attributes, variant?.attributes, selectedAttributes, getAttrValue])

    const doesOptionExist = useCallback((attrKey, optionValue) => {
        if (!variants || !Array.isArray(variants) || variants.length === 0) return true
        return variants.some((v) => {
            const attrs = v?.attributes
            const val = getAttrValue(attrs, attrKey)
            if (val === undefined || val === null) return false
            if (String(val) !== String(optionValue)) return false
            if (typeof v?.stock === 'number') return v.stock > 0
            return true
        })
    }, [variants, getAttrValue])

    const isOptionCompatible = useCallback((attrKey, optionValue) => {
        if (!variants || !Array.isArray(variants) || variants.length === 0) return true
        const candidate = { ...selection, [attrKey]: String(optionValue) }
        return variants.some((v) => {
            const attrs = v?.attributes
            const matches = Object.entries(candidate).every(([k, val]) => String(getAttrValue(attrs, k)) === String(val))
            if (!matches) return false
            if (typeof v?.stock === 'number') return v.stock > 0
            return true
        })
    }, [variants, selection, getAttrValue])

    const pickBestVariantForChange = useCallback((changedKey, changedValue) => {
        if (!variants || !Array.isArray(variants) || variants.length === 0) return null
        const candidates = variants.filter((v) => {
            const attrs = v?.attributes
            if (String(getAttrValue(attrs, changedKey)) !== String(changedValue)) return false
            if (typeof v?.stock === 'number') return v.stock > 0
            return true
        })
        if (!candidates.length) return null
        const attributeKeys = (product?.variantConfig?.attributes || []).map((a) => a.key)
        const currentSelection = selection
        let best = candidates[0]
        let bestScore = -1
        for (const c of candidates) {
            const attrs = c?.attributes
            let score = 0
            for (const k of attributeKeys) {
                if (k === changedKey) continue
                const cur = currentSelection?.[k]
                if (!cur) continue
                const cv = getAttrValue(attrs, k)
                if (cv !== undefined && String(cv) === String(cur)) score += 1
            }
            if (score > bestScore) { bestScore = score; best = c }
        }
        return best
    }, [variants, product?.variantConfig?.attributes, selection, getAttrValue])

    const buildUrlFromVariant = useCallback((v) => {
        const params = new URLSearchParams()
        const attrs = v?.attributes
        if (product?.variantConfig?.attributes) {
            product.variantConfig.attributes.forEach((attr) => {
                const value = getAttrValue(attrs, attr.key)
                if (value !== undefined && value !== null && String(value).length) {
                    params.set(attr.key, String(value))
                }
            })
        }
        const qs = params.toString()
        return `${WEBSITE_PRODUCT_DETAILS(product.slug)}${qs ? `?${qs}` : ''}`
    }, [product?.slug, product?.variantConfig?.attributes, getAttrValue])

    useEffect(() => {
        setActiveThumb(displayMedia?.[0]?.secure_url)
    }, [displayMedia])

    useEffect(() => {
        if (cartStore.count > 0) {
            const existingProduct = cartStore.products.findIndex(
                (cartProduct) => cartProduct.productId === product._id && cartProduct.variantId === variant._id
            )
            if (existingProduct >= 0) {
                setIsAddedIntoCart(true)
            } else {
                setIsAddedIntoCart(false)
            }
        }
        setIsProductLoading(false)
    }, [variant])

    const handleThumb = (thumbUrl) => {
        setActiveThumb(thumbUrl)
    }

    const handleQty = (actionType) => {
        if (actionType === 'inc') {
            setQty(prev => prev + 1)
        } else {
            if (qty !== 1) setQty(prev => prev - 1)
        }
    }

    const handleAddToCart = () => {
        const cartProduct = {
            productId: product._id,
            variantId: variant._id,
            name: product.name,
            url: product.slug,
            attributes: variant.attributes || {},
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
            media: activeThumb || displayMedia?.[0]?.secure_url,
            qty: qty
        }
        dispatch(addIntoCart(cartProduct))
        setIsAddedIntoCart(true)
        showToast('success', 'Product added into cart.')
    }

    return (
        <div>
            {isProductLoading && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
                    <Image src={loadingSvg} width={80} height={80} alt="Loading" />
                </div>
            )}

            {/* ── Section 1: Breadcrumb / Hero ── */}
            <section className="py-12 md:py-18 lg:py-18 px-3 lg:px-8 xl:px-0 bg-center bg-no-repeat bg-contain relative">
                <div className="absolute inset-0">
                    <img src="/assets/img/overlay_dark.png" className="w-full h-full" alt="img" />
                </div>
                <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:justify-between gap-3">
                        <div className="md:w-6/12">
                            <h1 className="text-5xl font-bold">Shop</h1>
                        </div>
                        <div className="flex md:justify-end gap-4 items-center md:w-6/12">
                            <div>
                                <Link href="/" className="line-link">Home</Link>
                            </div>
                            <div>
                                <Link href={WEBSITE_SHOP} className="flex gap-4 font-bold text-[var(--shop-sub-title)]">
                                    <span className="text-[var(--primary)]"><i className="fa-solid fa-chevron-right"></i></span>
                                    Shop
                                </Link>
                            </div>
                            <div>
                                <span className="flex gap-4 font-bold text-[var(--shop-sub-title)]">
                                    <span className="text-[var(--primary)]"><i className="fa-solid fa-chevron-right"></i></span>
                                    {product?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 2: Product Details ── */}
            <section className="lg:pb-24 pb-12 md:pb-18 px-3 lg:px-8 xl:px-0 bg-center bg-no-repeat bg-contain relative">
                <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">

                        {/* Image Gallery */}
                        <div className="">
                            <div className="flex flex-col md:flex-row gap-6">

                                {/* Thumbnails */}
                                <div className="md:w-3/12 order-2 md:order-1">
                                    <div className="md:h-[650px] pb-3 flex md:flex-col gap-3 overflow-auto">
                                        {displayMedia?.map((thumb) => (
                                            <div
                                                key={thumb._id}
                                                onClick={() => handleThumb(thumb.secure_url)}
                                                data-image={thumb.secure_url}
                                                className={`thumb p-4 xl:size-35 2xl:size-40 cursor-pointer flex-shrink-0 ${
                                                    thumb.secure_url === activeThumb
                                                        ? 'border border-[var(--primary)]'
                                                        : ''
                                                }`}
                                            >
                                                <Image
                                                    src={thumb?.secure_url || imgPlaceholder.src}
                                                    width={100}
                                                    height={100}
                                                    alt="product thumbnail"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Image */}
                                <div className="md:w-9/12 order-1 md:order-2">
                                    <div id="zoomContainer" className="relative overflow-hidden cursor-zoom-in">
                                        <Image
                                            id="mainImage"
                                            src={activeThumb || displayMedia?.[0]?.secure_url || imgPlaceholder.src}
                                            width={650}
                                            height={650}
                                            alt="product"
                                            className="w-full transition duration-300"
                                        />
                                        <button
                                            id="zoomIcon"
                                            className="absolute top-3 right-3 bg-black/60 text-white flex items-center justify-center size-9 rounded-full"
                                        >
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="xl:ps-12 mt-6 xl:mt-0 relative">

                            {/* Discount + Share */}
                            <div className="flex justify-between mb-6">
                                <div>
                                    <div className="mt-2">
                                        <p className="text-lg font-bold bg-[var(--primary)] px-2">
                                            -{variant.discountPercentage}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="flex justify-between mb-6">
                                <div>
                                    <h2 className="text-4xl font-bold">{product.name}</h2>
                                </div>
                            </div>

                            {/* Price + Rating */}
                            <div className="flex gap-3 items-center mb-6">
                                <div className="flex gap-2 items-center relative after:content-['|'] after:text-[var(--text-gray)] after:text-2xl">
                                    <p className="text-2xl text-black font-bold">
                                        {variant.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                    </p>
                                    <del className="text-lg text-gray-300">
                                        {variant.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                    </del>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <IoStar key={i} className="text-[var(--primary)]" />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-[var(--text-light)]">({reviewCount} Reviews)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Short description */}
                            <div
                                className="line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                            />

                            <div className="border border-dashed border-[var(--text-light)] mb-6 mt-6" />

                            {/* Dynamic Variant Attribute Selectors */}
                            {product.variantConfig?.attributes && Array.isArray(product.variantConfig.attributes) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 mb-6">
                                    {product.variantConfig.attributes.map((attrConfig, colIdx) => {
                                        const attrKey = attrConfig.key
                                        const attrLabel = attrConfig.label
                                        const attrUnit = attrConfig.unit
                                        const currentValue = getAttrValue(variant?.attributes, attrKey) || selectedAttributes?.[attrKey] || ''
                                        const availableOptions = attributeOptions[attrKey] || []
                                        if (availableOptions.length === 0) return null

                                        return (
                                            <div
                                                key={attrKey}
                                                className={`mb-3 md:mb-0 ${colIdx % 2 === 0 ? 'md:border-r border-r-[var(--text-light)] md:pe-3' : 'md:ps-2'}`}
                                            >
                                                <h3 className="text-lg font-bold mb-2">
                                                    {attrLabel} : <span>{currentValue}{attrUnit ? ` ${attrUnit}` : ''}</span>
                                                </h3>
                                                <div className="details-filter-group flex gap-3 flex-wrap">
                                                    {availableOptions.map(optionValue => {
                                                        const isSelected = String(optionValue) === String(currentValue)
                                                        const exists = doesOptionExist(attrKey, optionValue)
                                                        const compatible = isOptionCompatible(attrKey, optionValue)
                                                        const isIncompatibleButSelectable = exists && !compatible && !isSelected

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={optionValue}
                                                                disabled={!exists}
                                                                onClick={() => {
                                                                    if (!exists) return
                                                                    setIsProductLoading(true)
                                                                    const best = pickBestVariantForChange(attrKey, optionValue)
                                                                    if (best) {
                                                                        const adjusted = (product?.variantConfig?.attributes || []).some((a) => {
                                                                            if (a.key === attrKey) return false
                                                                            const cur = selection?.[a.key]
                                                                            if (!cur) return false
                                                                            const next = getAttrValue(best?.attributes, a.key)
                                                                            return next !== undefined && String(next) !== String(cur)
                                                                        })
                                                                        if (adjusted) {
                                                                            showToast('warning', 'Some options were adjusted to match available configurations.')
                                                                        }
                                                                        router.push(buildUrlFromVariant(best))
                                                                        return
                                                                    }
                                                                    const params = new URLSearchParams()
                                                                    if (product.variantConfig?.attributes) {
                                                                        product.variantConfig.attributes.forEach(attr => {
                                                                            const value = attr.key === attrKey ? optionValue : selection?.[attr.key]
                                                                            if (value !== undefined && value !== null && String(value).length) {
                                                                                params.set(attr.key, value)
                                                                            }
                                                                        })
                                                                    }
                                                                    router.push(`${WEBSITE_PRODUCT_DETAILS(product.slug)}?${params.toString()}`)
                                                                }}
                                                                className={`details-filter-btn ${isSelected ? 'active' : ''} ${!exists ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isIncompatibleButSelectable ? 'border-yellow-400 text-yellow-700' : ''}`}
                                                            >
                                                                {optionValue}{attrUnit ? ` ${attrUnit}` : ''}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            <div className="border border-dashed border-[var(--text-light)] mb-6" />

                            {/* Quantity + Cart */}
                            <h3 className="text-lg font-bold mb-2">Quantity :</h3>
                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 mb-6">

                                {/* Stepper */}
                                <div className="border border-[var(--text-light)] flex justify-between px-4 py-2 items-center">
                                    <button
                                        type="button"
                                        id="decreaseQty"
                                        className="text-base font-bold hover:text-[var(--primary)]"
                                        onClick={() => handleQty('desc')}
                                    >
                                        <HiMinus />
                                    </button>
                                    <span id="quantityValue">{qty}</span>
                                    <button
                                        type="button"
                                        id="increaseQty"
                                        className="text-base font-bold hover:text-[var(--primary)]"
                                        onClick={() => handleQty('inc')}
                                    >
                                        <HiPlus />
                                    </button>
                                </div>

                                {/* Add to Cart / Go to Cart */}
                                <div className="flex gap-3 flex-wrap w-full">
                                    {!isAddedIntoCart ? (
                                        <ButtonLoading
                                            type="button"
                                            text="Add To Cart"
                                            className="cart-btn w-full"
                                            onClick={handleAddToCart}
                                        />
                                    ) : (
                                        <Button className="cart-btn w-full" type="button" asChild>
                                            <Link href={WEBSITE_CART}>Go To Cart</Link>
                                        </Button>
                                    )}
                                </div>

                                {/* Wishlist */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Description / Review Tabs ── */}
            <section className="lg:pb-24 pb-12 md:pb-18 px-3 lg:px-8 xl:px-0 bg-center bg-no-repeat bg-contain relative">
                <div className="max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10">

                    {/* Tab buttons */}
                    <div className="flex gap-0 mb-8 border-b border-b-[var(--primary)]">
                        <button
                            className={`tab-btn cursor-pointer ${activeTab === 'description' ? 'active-tab' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                    </div>

                    {/* Description tab */}
                    {activeTab === 'description' && (
                        <div id="description" className="tab-content">
                            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default ProductDetails