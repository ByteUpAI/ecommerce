'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_CONTACT_QUERY_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_CONTACT_QUERY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"

import { useCallback, useMemo } from "react"
import axios from "axios"
import { MenuItem } from "@mui/material"
import { showToast } from "@/lib/showToast"
import { useQueryClient } from "@tanstack/react-query"

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_CONTACT_QUERY_SHOW, label: 'Contact Queries' },
]

const ContactQueryPage = () => {

    const queryClient = useQueryClient()

    const columns = useMemo(() => {
        return columnConfig(DT_CONTACT_QUERY_COLUMN)
    }, [])

    const handleUpdateStatus = useCallback(async (ids, status) => {
        try {
            const { data: res } = await axios.put('/api/contact-query/status', { ids, status })
            if (!res.success) {
                throw new Error(res.message)
            }
            showToast('success', res.message)
            queryClient.invalidateQueries({ queryKey: ['contact-query-data'] })
        } catch (error) {
            showToast('error', error.message)
        }
    }, [queryClient])

    const action = useCallback((row, deleteType, handleDelete) => {
        const id = row?.original?._id
        return [
            <MenuItem key="mark-pending" onClick={() => handleUpdateStatus([id], 'pending')}>
                Mark Pending
            </MenuItem>,
            <MenuItem key="mark-replied" onClick={() => handleUpdateStatus([id], 'replied')}>
                Mark Replied
            </MenuItem>,
            <MenuItem key="mark-resolved" onClick={() => handleUpdateStatus([id], 'resolved')}>
                Mark Resolved
            </MenuItem>,
            <MenuItem key="mark-blocked" onClick={() => handleUpdateStatus([id], 'blocked')}>
                Mark Blocked
            </MenuItem>,
            <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
        ]
    }, [handleUpdateStatus])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />

            <Card className="py-0 rounded shadow-sm gap-0">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <div className="flex justify-between items-center">
                        <h4 className='text-xl font-semibold'>Contact Queries</h4>
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0">
                    <DatatableWrapper
                        queryKey="contact-query-data"
                        fetchUrl="/api/contact-query"
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndpoint="/api/contact-query/export"
                        deleteEndpoint="/api/contact-query/delete"
                        deleteType="SD"
                        trashView={`${ADMIN_TRASH}?trashof=contact-query`}
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ContactQueryPage
