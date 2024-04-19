'use client'
import { setUnits } from '@/app/store/dataSlice'
import { RootState } from '@/app/store/store'
import { TypeWeatherData } from '@/app/types'
import { getImageWeather, toggleUnits } from '@/app/utils/utils'
import moment from 'moment'
import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const TodayWeather: FC<{ weatherData: TypeWeatherData }> = ({ weatherData }) => {
    const unitSystem = useSelector((state: RootState) => state.units)
    const [currentTime, setCurrentTime] = useState<string>(moment().format('dddd, hh:mm A'))
    const dispatch = useDispatch()

    //time update every 10 seconds
    useEffect(() => {
        let interval = setInterval(() => {
            setCurrentTime(moment().format('dddd, hh:mm A'))
        }, 10000)
        return () => clearInterval(interval)
    }, [])


    return (
        <section className=' dark:bg-darkBlue bg-white p-5 rounded-2xl space-y-5'>
            <div className='flex gap-4 justify-between items-start'>
                <div>
                    <p className='text-base dark:text-darkGray'>Current Weather</p>
                    <p className='text-xl font-medium text-darkBlue dark:text-white tracking-normal'>{currentTime}</p>
                </div>
                <select
                    name="unitSystem"
                    id=""
                    onChange={(e) => dispatch(setUnits(e.target.value))}
                    className='bg-white dark:bg-darkBlue text-darkBlue dark:text-white outline-none text-sm sm:text-base'
                >
                    <option value="metric" >Celsius</option>
                    <option value="imperial">Fahrenheit</option>
                </select>
            </div>
            <div className='flex items-center gap-4 '>
                <Image
                    src={getImageWeather(weatherData.weather[0].icon)}
                    alt={weatherData.weather[0].main}
                    width={100}
                    height={100}
                />
                <div className='flex gap-1'>
                    <h1 className='text-5xl tracking-wide font-semibold text-darkBlue dark:text-white'>
                        {toggleUnits(weatherData.main.temp, unitSystem)}
                    </h1>
                    <span className='text-sm'>
                        {unitSystem === 'metric' ? '°C' : '°F'}
                    </span>
                </div>
                <div className='text-sm'>
                    <p className='capitalize dark:text-skyBlue'>{weatherData.weather[0].description}</p>
                    <p className='text-darkBlue dark:text-darkGray'>Feels Like {toggleUnits(weatherData.main.feels_like, unitSystem)}°</p>
                </div>
            </div>
        </section>
    )
}

export default TodayWeather
