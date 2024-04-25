'use client'
import { addLocalStorage, previousLocations } from '@/app/src/store/dataSlice'
import { RootState } from '@/app/src/store/store'
import { toggleUnits } from '@/app/src/utils/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowBack } from "react-icons/io";

const Page = () => {
    const previousLocations = useSelector((state: RootState) => state.previousLocations)
    const unitSystem = useSelector((state: RootState) => state.units)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(addLocalStorage())
    }, [])

    const renderLocation = (location: previousLocations, index: number) => (
        <Link href={`/weather/${location.lat}/${location.lon}`} key={index} className='max-w-sm block '>
            <div className={`${location.favorite ? 'bg-green-400 text-white' : 'bg-white dark:bg-darkBlue'} p-3 my-3 rounded-xl cursor-pointer hover:bg-skyBlue hover:text-white flex items-center justify-between max-w-sm h-[72px]`}>
                <div className='font-semibold text-base leading-5'>
                    <h1>{`${location.cityName}, ${location.country}`}</h1>
                    <p className='capitalize'>{location.weatherDescription}</p>
                </div>

                <h1 className='text-3xl font-semibold'>{`${toggleUnits(location.temp, unitSystem)}°${unitSystem === 'metric' ? 'C' : 'F'}`}</h1>

            </div>
        </Link>
    )

    return (
        <div className='p-4 sm:p-8 max-Width'>
            <p className=' flex  items-center mb-5 cursor-pointer' onClick={() => router.back()}><IoIosArrowBack /> Back</p>
            <h1 className='font-bold text-3xl'>Favorite:</h1>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-3 items-center'>
                {
                    previousLocations.filter(location => location.favorite).length > 0
                        ? previousLocations.filter(location => location.favorite).map(renderLocation)
                        : <div className=' py-5'>No favorite locations</div>
                }
            </div>
            <h1 className='mt-5 font-bold text-3xl'>Recent:</h1>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-3 items-center'>
                {
                    previousLocations.filter(location => !location.favorite).length > 0
                        ? previousLocations.filter(location => !location.favorite).map(renderLocation)
                        : <div className=' py-5'>No recent locations</div>
                }
            </div>
        </div>
    )
}

export default Page