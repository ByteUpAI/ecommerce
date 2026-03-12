import React from 'react'
import UserPanelNavigation from './UserPanelNavigation'

const UserPanelLayout = ({ children }) => {
    return (
        <div className='flex flex-col md:flex-row gap-4 md:gap-6 w-full'>
            <div className='w-full md:w-64 flex-shrink-0'>
                <UserPanelNavigation />
            </div>
            <div className='w-full min-w-0 flex-1'>
                {children}
            </div>
        </div>
    )
}

export default UserPanelLayout