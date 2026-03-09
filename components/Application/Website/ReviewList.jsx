import Image from 'next/image'
import React from 'react'
import usericon from '@/public/assets/images/user.png'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IoStar, IoStarOutline } from 'react-icons/io5'

dayjs.extend(relativeTime)

const ReviewList = ({ review }) => {
    return (
        <div className="border-b border-b-[var(--text-light)] pb-4 flex flex-col gap-3">

            {/* Avatar + Name + Stars */}
            <div className="flex gap-4">
                <div>
                    <Image
                        src={review?.avatar?.url || usericon.src}
                        width={64}
                        height={64}
                        alt="user icon"
                        className="w-16 h-16 object-cover"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <p className="text-lg font-bold text-black">{review?.reviewedBy}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) =>
                                i < (review?.rating || 0)
                                    ? <IoStar key={i} className="text-[var(--primary)]" />
                                    : <IoStarOutline key={i} className="text-[var(--text-light)]" />
                            )}
                        </div>
                        <div>
                            <p className="text-[var(--text-light)]">(Review {review?.rating || 0})</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date */}
            <div className="flex gap-2">
                <p className="text-[var(--text-gray)]">{dayjs(review?.createdAt).format('MMMM DD, YYYY')}</p>
            </div>

            {/* Title + Review text */}
            <div>
                {review?.title && (
                    <p className="text-lg font-bold text-black mb-1">{review?.title}</p>
                )}
                <p className="text-gray-600">{review?.review}</p>
            </div>

        </div>
    )
}

export default ReviewList
