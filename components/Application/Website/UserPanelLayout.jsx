import React from 'react'
import UserPanelNavigation from './UserPanelNavigation'

const UserPanelLayout = ({ children }) => {
    return (
        <div className='flex flex-col md:flex-row gap-4 md:gap-6 max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto w-full px-3 lg:px-8 xl:px-0'>
            <div className='md:w-56 flex-shrink-0'>
                <UserPanelNavigation />
            </div>
            <div className='min-w-0 flex-1'>
                {children}
            </div>
        </div>
    )
}

export default UserPanelLayout