'use client'
import { toggleFavoriteLocation } from '@/app/src/store/dataSlice'
import { RootState } from '@/app/src/store/store'
import { TypeWeatherData } from '@/app/src/types'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GoHeart, GoHeartFill } from "react-icons/go";
import { TbLocationCheck } from "react-icons/tb";
import { IoIosArrowBack } from 'react-icons/io'
import { useRouter } from 'next/navigation'

const Navbar: FC<{ weatherData: TypeWeatherData }> = ({ weatherData }) => {
    const prevLocations = useSelector((state: RootState) => state.previousLocations ?? [])
    const router = useRouter()
    const dispatch = useDispatch()
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)


    // Toggle Dark Mode
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }

    // Toggle Favorite
    const toggleFavorite = () => {
        const locationData = { lat: weatherData.coord.lat, lon: weatherData.coord.lon };
        dispatch(toggleFavoriteLocation(locationData));
    }

    // Get Heart Icon based on previous locations
    const getHeartIcon = () => {
        const location = prevLocations.find(prev =>
            prev.lat === weatherData.coord.lat && prev.lon === weatherData.coord.lon
        );
        return location && location.favorite ? <GoHeartFill /> : <GoHeart />;
    }

    return (
        <nav className='flex items-center gap-5 px-4 py-5 bg-white dark:bg-darkBlue rounded-2xl'>
            <h1 className='text-skyBlue font-semibold text-xl flex items-center gap-1 cursor-pointer'
                onClick={() => router.push('/')}
            >
                <IoIosArrowBack size={20} />
                <span className='hidden sm:inline'>SkyCast</span>
            </h1>
            <h1 className='cursor-pointer flex gap-1 items-center truncate ... text-sm sm:text-base'
                onClick={toggleFavorite}
            >
                {getHeartIcon()}{weatherData.name}
            </h1>
            <div className='ml-auto flex gap-5 items-center'>
                <Link href={`/locations`}
                    title='Check previous locations'
                >
                    <TbLocationCheck size={20} />
                </Link>
                <button className='bg-darkBlue dark:bg-white px-4 sm:px-7 py-2 text-white dark:text-darkBlue rounded-xl'
                    onClick={toggleDarkMode}
                >
                    {isDarkMode ? 'Light' : 'Dark'}
                </button>
            </div>
        </nav>
    )
}

export default Navbar