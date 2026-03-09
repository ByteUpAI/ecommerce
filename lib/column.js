import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from "@mui/material"
import dayjs from "dayjs"
import userIcon from '@/public/assets/images/user.png'
export const DT_CATEGORY_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Category Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
]

export const DT_PRODUCT_COLUMN = [
    {
        accessorKey: 'name',
        header: 'Product Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage',
    },

]


export const DT_PRODUCT_VARIANT_COLUMN = [
    {
        accessorKey: 'product',
        header: 'Product Name',
    },
    {
        accessorKey: 'variantName',
        header: 'Variant',
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
    },
    {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage',
    },

]


export const DT_COUPON_COLUMN = [
    {
        accessorKey: 'code',
        header: 'Code',
    },


    {
        accessorKey: 'discountPercentage',
        header: 'Discount Percentage',
    },

    {
        accessorKey: 'minShoppingAmount',
        header: 'Min. Shopping Amount',
    },
    {
        accessorKey: 'validity',
        header: 'Validity',
        Cell: ({ renderedCellValue }) => (
            new Date() > new Date(renderedCellValue) ? <Chip color="error" label={dayjs(renderedCellValue).format('DD/MM/YYYY')} /> : <Chip color="success" label={dayjs(renderedCellValue).format('DD/MM/YYYY')} />
        )
        ,
    },

]


export const DT_CUSTOMERS_COLUMN = [
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        Cell: ({ renderedCellValue }) => (
            <Avatar>
                <AvatarImage src={renderedCellValue?.url || userIcon.src} />
            </Avatar>
        )
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'isEmailVerified',
        header: 'Is Verified',
        Cell: ({ renderedCellValue }) => (
            renderedCellValue ? <Chip color="success" label="Verified" /> : <Chip color="error" label="Not Verified" />
        )
    },
    {
        accessorKey: 'isBlocked',
        header: 'Blocked',
        Cell: ({ renderedCellValue }) => (
            renderedCellValue ? <Chip color="error" label="Blocked" /> : <Chip color="success" label="Active" />
        )
    },


]

export const DT_REVIEW_COLUMN = [

    {
        accessorKey: 'product',
        header: 'Product',
    },

    {
        accessorKey: 'user',
        header: 'User',
    },

    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'rating',
        header: 'Rating',
    },
    {
        accessorKey: 'review',
        header: 'Review',
    },
]

export const DT_ORDER_COLUMN = [

    {
        accessorKey: 'order_id',
        header: 'Order Id',
    },

    {
        accessorKey: 'name',
        header: 'Name',
    },

    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'country',
        header: 'Country',
    },
    {
        accessorKey: 'state',
        header: 'State',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },

    {
        accessorKey: 'pincode',
        header: 'Pincode',
    },
    {
        accessorKey: 'totalItem',
        header: 'Total Item',
        Cell: ({ renderedCellValue, row }) => (<span>{row?.original?.products?.length || 0}</span>)
    },
    {
        accessorKey: 'subtotal',
        header: 'Subtotal',
    },
    {
        accessorKey: 'discount',
        header: 'Discount',
        Cell: ({ renderedCellValue }) => (<span>{Math.round(renderedCellValue)}</span>)
    },
    {
        accessorKey: 'couponDiscountAmount',
        header: 'Coupon Discount',
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
]

export const DT_CONTACT_QUERY_COLUMN = [
    {
        accessorKey: 'supportId',
        header: 'Support ID',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },

    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'query',
        header: 'Query',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }) => {
            const status = row?.original?.status || 'pending'
            const color = status === 'resolved'
                ? 'success'
                : status === 'replied'
                    ? 'info'
                    : status === 'blocked'
                        ? 'error'
                        : 'warning'
            return <Chip color={color} label={status} className='capitalize' />
        }
    },
]