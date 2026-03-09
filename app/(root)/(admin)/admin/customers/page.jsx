'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {   DT_CUSTOMERS_COLUMN, } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { showToast } from "@/lib/showToast"
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"

import { ListItemIcon, MenuItem } from '@mui/material'
import axios from "axios"
import BlockIcon from '@mui/icons-material/Block';
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: '', label: 'Customers' },
]
const ShowCustomers = () => {

    const queryClient = useQueryClient()
    const blockMutation = useMutation({
        mutationFn: async ({ id, isBlocked }) => {
            const { data: response } = await axios.put('/api/customers/block', { ids: [id], isBlocked })
            if (!response.success) {
                throw new Error(response.message)
            }
            return response
        },
        onSuccess: (data) => {
            showToast('success', data.message)
            queryClient.invalidateQueries(['customers-data'])
        },
        onError: (error) => {
            showToast('error', error.message)
        }
    })

    const columns = useMemo(() => {
        return columnConfig(DT_CUSTOMERS_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []

        actionMenu.push(
            <MenuItem
                key="block"
                onClick={() => blockMutation.mutate({ id: row.original._id, isBlocked: !row.original.isBlocked })}
            >
                <ListItemIcon>
                    <BlockIcon />
                </ListItemIcon>
                {row.original.isBlocked ? 'Unblock' : 'Block'}
            </MenuItem>
        )

        actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [blockMutation])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />

            <Card className="py-0 rounded shadow-sm gap-0">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <div className="flex justify-between items-center">
                        <h4 className='text-xl font-semibold'>Customers</h4>

                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0">
                    <DatatableWrapper
                        queryKey="customers-data"
                        fetchUrl="/api/customers"
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint="/api/customers/export"
                        deleteEndpoint="/api/customers/delete"
                        deleteType="SD"
                        trashView={`${ADMIN_TRASH}?trashof=customers`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowCustomers