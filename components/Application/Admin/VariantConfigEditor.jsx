'use client'

import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const normalizeKey = (value) => {
    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
}

const normalizeOptions = (value) => {
    if (!value) return []
    return String(value)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
}

const VariantConfigEditor = ({ value, onChange }) => {
    const attributes = useMemo(() => {
        if (Array.isArray(value)) return value
        return []
    }, [value])

    const [keyErrors, setKeyErrors] = useState({})

    useEffect(() => {
        const seen = new Set()
        const nextErrors = {}

        attributes.forEach((attr, idx) => {
            const key = normalizeKey(attr?.key)
            if (!key) {
                nextErrors[idx] = 'Key is required'
                return
            }
            if (seen.has(key)) {
                nextErrors[idx] = 'Key must be unique'
                return
            }
            seen.add(key)
        })

        setKeyErrors(nextErrors)
    }, [attributes])

    const updateAttributes = (next) => {
        onChange?.(next)
    }

    const updateAttr = (index, patch) => {
        const next = attributes.map((a, i) => {
            if (i !== index) return a
            return { ...a, ...patch }
        })
        updateAttributes(next)
    }

    const addAttribute = () => {
        updateAttributes([
            ...attributes,
            {
                key: '',
                label: '',
                required: true,
                unit: '',
                type: 'text',
                options: [],
            },
        ])
    }

    const removeAttribute = (index) => {
        updateAttributes(attributes.filter((_, i) => i !== index))
    }

    const moveAttribute = (index, direction) => {
        const nextIndex = index + direction
        if (nextIndex < 0 || nextIndex >= attributes.length) return

        const next = [...attributes]
        const temp = next[index]
        next[index] = next[nextIndex]
        next[nextIndex] = temp
        updateAttributes(next)
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">Variant Attributes</div>
                <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                    Add Attribute
                </Button>
            </div>

            {attributes.length === 0 && (
                <div className="text-sm text-muted-foreground">
                    Add at least one attribute so variants can be created.
                </div>
            )}

            {attributes.map((attr, idx) => {
                const keyValue = attr?.key ?? ''
                const labelValue = attr?.label ?? ''
                const unitValue = attr?.unit ?? ''
                const requiredValue = attr?.required !== false
                const typeValue = attr?.type || 'text'
                const optionsValue =
                    typeof attr?.optionsText === 'string'
                        ? attr.optionsText
                        : Array.isArray(attr?.options)
                            ? attr.options.join(', ')
                            : ''

                return (
                    <div key={idx} className="rounded border p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-3">
                                <div className="text-xs mb-1">Label</div>
                                <Input
                                    value={labelValue}
                                    placeholder="e.g. Diameter"
                                    onChange={(e) => {
                                        const nextLabel = e.target.value
                                        const nextKey = keyValue ? keyValue : normalizeKey(nextLabel)
                                        updateAttr(idx, { label: nextLabel, key: nextKey })
                                    }}
                                />
                            </div>

                            <div className="md:col-span-3">
                                <div className="text-xs mb-1">Key</div>
                                <Input
                                    value={keyValue}
                                    placeholder="e.g. diameter"
                                    onChange={(e) => updateAttr(idx, { key: normalizeKey(e.target.value) })}
                                />
                                {keyErrors[idx] && (
                                    <div className="text-xs text-red-500 mt-1">{keyErrors[idx]}</div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-xs mb-1">Type</div>
                                <Select
                                    value={typeValue}
                                    onValueChange={(val) => {
                                        const nextType = val
                                        if (nextType !== 'select') {
                                            updateAttr(idx, { type: nextType, options: [], optionsText: '' })
                                        } else {
                                            updateAttr(idx, { type: nextType })
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="number">Number</SelectItem>
                                        <SelectItem value="select">Select</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-xs mb-1">Unit</div>
                                <Input
                                    value={unitValue}
                                    placeholder="e.g. mm"
                                    onChange={(e) => updateAttr(idx, { unit: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 flex items-end gap-2">
                                <div className="flex items-center gap-2 pb-2">
                                    <Checkbox
                                        checked={requiredValue}
                                        onCheckedChange={(checked) => updateAttr(idx, { required: Boolean(checked) })}
                                    />
                                    <span className="text-sm">Required</span>
                                </div>
                            </div>
                        </div>

                        {typeValue === 'select' && (
                            <div>
                                <div className="text-xs mb-1">Options (comma separated)</div>
                                <Input
                                    value={optionsValue}
                                    placeholder="e.g. 32, 40, 50"
                                    onChange={(e) =>
                                        updateAttr(idx, {
                                            optionsText: e.target.value,
                                            options: normalizeOptions(e.target.value),
                                        })
                                    }
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveAttribute(idx, -1)}
                                    disabled={idx === 0}
                                >
                                    Up
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveAttribute(idx, 1)}
                                    disabled={idx === attributes.length - 1}
                                >
                                    Down
                                </Button>
                            </div>

                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeAttribute(idx)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default VariantConfigEditor
