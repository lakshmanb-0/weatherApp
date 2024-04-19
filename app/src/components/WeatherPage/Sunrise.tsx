import { TypeWeatherData } from '@/app/src/types'
import moment from 'moment'
import React, { FC } from 'react'
import { FiSunrise, FiSunset } from "react-icons/fi";

const Sunrise: FC<{ weatherData: TypeWeatherData }> = ({ weatherData }) => {
    const { sunrise, sunset } = weatherData.sys

    // format time for sunrise and sunset time 
    const formatTime = (timestamp: number) => moment(timestamp * 1000).format('hh:mm A')

    return (
        <div className='flex justify-around items-center text-center w-full bg-white dark:bg-darkBlue rounded-2xl py-7 px-3'>
            <div>
                <FiSunrise size={25} className='w-fit mx-auto' />
                <p className='py-1 font-semibold'>Sunrise</p>
                <p>{formatTime(sunrise)}</p>
            </div>
            <div>
                <FiSunset size={25} className='w-fit mx-auto' />
                <p className='py-1 font-semibold'>Sunset</p>
                <p>{formatTime(sunset)}</p>
            </div>
        </div>
    )
}

export default Sunrise