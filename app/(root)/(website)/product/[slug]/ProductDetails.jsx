'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IoStar } from "react-icons/io5";
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useCallback, useState } from "react"
import { useRouter } from 'next/navigation'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { decode, encode } from "entities";
import { HiMinus, HiPlus } from "react-icons/hi2";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import loadingSvg from '@/public/assets/images/loading.svg'
import ProductReveiw from "@/components/Application/Website/ProductReveiw";

const ProductDetails = ({ product, variant, attributeOptions, variants, selectedAttributes, reviewCount }) => {

    const router = useRouter()

    const dispatch = useDispatch()
    const cartStore = useSelector(store => store.cartStore)
    
    const [activeThumb, setActiveThumb] = useState()
    const [qty, setQty] = useState(1)
    const [isAddedIntoCart, setIsAddedIntoCart] = useState(false)
    const [isProductLoading, setIsProductLoading] = useState(false)

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
            if (typeof v?.stock === 'number') {
                return v.stock > 0
            }
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
                if (cv !== undefined && String(cv) === String(cur)) {
                    score += 1
                }
            }
            if (score > bestScore) {
                bestScore = score
                best = c
            }
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
        setActiveThumb(variant?.media[0]?.secure_url)
    }, [variant])

    useEffect(() => {
        if (cartStore.count > 0) {
            const existingProduct = cartStore.products.findIndex((cartProduct) => cartProduct.productId === product._id && cartProduct.variantId === variant._id)

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
            if (qty !== 1) {
                setQty(prev => prev - 1)
            }
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
            media: variant?.media[0]?.secure_url,
            qty: qty
        }

        dispatch(addIntoCart(cartProduct))
        setIsAddedIntoCart(true)
        showToast('success', 'Product added into cart.')
    }

    return (
        <div className="lg:px-32 px-4">

            {isProductLoading &&
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
                    <Image src={loadingSvg} width={80} height={80} alt="Loading" />
                </div>
            }

            <div className="my-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={WEBSITE_SHOP}>Product</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>{product?.name} </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
                <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">
                    <div className="xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]">
                        <Image
                            src={activeThumb || imgPlaceholder.src}
                            width={650}
                            height={650}
                            alt="product"
                            className="border rounded max-w-full"
                        />
                    </div>
                    <div className="flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]">
                        {variant?.media?.map((thumb) => (
                            <Image
                                key={thumb._id}
                                src={thumb?.secure_url || imgPlaceholder.src}
                                width={100}
                                height={100}
                                alt="product thumbnail"
                                className={`md:max-w-full max-w-16 rounded cursor-pointer ${thumb.secure_url === activeThumb ? 'border-2 border-primary' : 'border'}`}
                                onClick={() => handleThumb(thumb.secure_url)}
                            />
                        ))}
                    </div>
                </div>

                <div className="md:w-1/2 md:mt-0 mt-5">
                    <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-1 mb-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IoStar key={i} />
                        ))}
                        <span className="text-sm ps-2">({reviewCount} Reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-semibold">{variant.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        <span className="text-sm line-through text-gray-500">{variant.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>


                        <span className="bg-red-500 rounded-2xl px-3 py-1 text-white text-xs ms-5">-{variant.discountPercentage}%</span>


                    </div>

                    <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: decode(product.description) }}></div>


                    {/* Dynamic Variant Attribute Selectors */}
                    {product.variantConfig?.attributes && Array.isArray(product.variantConfig.attributes) && product.variantConfig.attributes.map((attrConfig) => {
                        const attrKey = attrConfig.key
                        const attrLabel = attrConfig.label
                        const attrUnit = attrConfig.unit
                        const currentValue = getAttrValue(variant?.attributes, attrKey) || selectedAttributes?.[attrKey] || ''
                        const availableOptions = attributeOptions[attrKey] || []

                        if (availableOptions.length === 0) return null

                        return (
                            <div key={attrKey} className="mt-5">
                                <p className="mb-2">
                                    <span className="font-semibold">{attrLabel}: </span>
                                    {currentValue}{attrUnit ? ` ${attrUnit}` : ''}
                                </p>
                                <div className="flex gap-3 flex-wrap">
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
                                                className={`border py-1 px-3 rounded-lg hover:bg-primary hover:text-white ${
                                                    isSelected ? 'bg-primary text-white' : ''
                                                } ${
                                                    !exists ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-inherit' : 'cursor-pointer'
                                                } ${
                                                    isIncompatibleButSelectable ? 'border-yellow-400 text-yellow-700 hover:border-primary hover:text-white' : ''
                                                }`}
                                            >
                                                {optionValue}{attrUnit ? ` ${attrUnit}` : ''}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                    <div className="mt-5">
                        <p className="font-bold mb-2">Quantity</p>
                        <div className="flex items-center h-10 border w-fit rounded-full">

                            <button type="button" className="h-full w-10 flex justify-center items-center" onClick={() => handleQty('desc')}>
                                <HiMinus />
                            </button>
                            <input type="text" value={qty} className="w-14 text-center border-none outline-offset-0" readOnly />
                            <button type="button" className="h-full w-10 flex justify-center items-center" onClick={() => handleQty('inc')}>
                                <HiPlus />
                            </button>

                        </div>
                    </div>


                    <div className="mt-5">
                        {!isAddedIntoCart ?
                            <ButtonLoading type="button" text="Add To Cart" className="w-full rounded-full py-6 text-md cursor-pointer" onClick={handleAddToCart} />
                            :
                            <Button className="w-full rounded-full py-6 text-md cursor-pointer" type="button" asChild>
                                <Link href={WEBSITE_CART}>Go To Cart</Link>
                            </Button>
                        }


                    </div>

                </div>
            </div>


            <div className="mb-10">
                <div className="shadow rounded border">
                    <div className="p-3 bg-gray-50 border-b">
                        <h2 className="font-semibold text-2xl">Product Description</h2>
                    </div>
                    <div className="p-3">
                        <div dangerouslySetInnerHTML={{ __html: encode(product.description) }}></div>
                    </div>
                </div>
            </div>

            <ProductReveiw productId={product._id} />

        </div>
    )
}

export default ProductDetails