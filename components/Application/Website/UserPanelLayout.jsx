import React from 'react'
import UserPanelNavigation from './UserPanelNavigation'

const UserPanelLayout = ({ children }) => {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-8 w-full items-start'>
            <div className='w-full lg:sticky lg:top-6'>
                <UserPanelNavigation />
            </div>
            <div className='w-full min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm min-h-[520px] overflow-hidden'>
                {children}
            </div>
        </div>
    )
}

export default UserPanelLayout