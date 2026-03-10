"use client";
import { Input } from "@/components/ui/input";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";


const Search = ({ isShow }) => {
    const router = useRouter()
    const [query, setQuery] = useState('')

    const handleSearch = () => {
        const value = (query || '').trim()
        if (!value) return
        router.push(`${WEBSITE_SHOP}?q=${encodeURIComponent(value)}`)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSearch()
        }
    }
    return (
        <div
            className={`absolute border-t transition-all left-0 py-5 md:px-32 px-5 z-10 bg-white w-full ${isShow ? "top-18" : "-top-full "
                }`}
        >
            <div className="flex justify-between items-center relative">
                <Input
                    className="rounded-full md:h-12 ps-5 border-primary"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button type="button" onClick={handleSearch} className="absolute right-3 cursor-pointer">
                    <IoSearchOutline size={20} className="text-gray-500" />
                </button>
            </div>
        </div>
    );
};

export default Search;
