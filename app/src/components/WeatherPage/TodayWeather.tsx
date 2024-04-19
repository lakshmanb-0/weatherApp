'use client'
import { setUnits } from '@/app/src/store/dataSlice'
import { RootState } from '@/app/src/store/store'
import { TypeWeatherData } from '@/app/src/types'
import { getImageWeather, getVideoWeather, toggleUnits } from '@/app/src/utils/utils'
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
        <section className=' bg-black/20 dark:bg-black/50 p-5 rounded-2xl relative overflow-hidden text-white font-semibold tracking-wide'>
            <div className='flex gap-4 justify-between items-start z-10'>
                <div>
                    <p className='text-base '>Current Weather</p>
                    <p className='text-xl font-medium  tracking-normal'>{currentTime}</p>
                </div>
                <select
                    name="unitSystem"
                    id=""
                    value={unitSystem}
                    onChange={(e) => dispatch(setUnits(e.target.value))}
                    className=' bg-transparent outline-none text-sm sm:text-bas'
                >
                    <option className='text-black' value="metric">Celsius</option>
                    <option className='text-black' value="imperial">Fahrenheit</option>
                </select>

            </div>
            <div className='flex items-center gap-4 py-5 z-10'>
                <Image
                    src={getImageWeather(weatherData.weather[0].icon)}
                    alt={weatherData.weather[0].main}
                    width={100}
                    height={100}
                />
                <div className='flex gap-1'>
                    <h1 className='text-5xl tracking-wide font-semibold  '>
                        {toggleUnits(weatherData.main.temp, unitSystem)}
                    </h1>
                    <span className='text-sm'>
                        {unitSystem === 'metric' ? '°C' : '°F'}
                    </span>
                </div>
                <div className='text-sm'>
                    <p className='capitalize text-skyBlue'>{weatherData.weather[0].description}</p>
                    <p className=' '>Feels Like {toggleUnits(weatherData.main.feels_like, unitSystem)}°</p>
                </div>
            </div>
            <div className='absolute w-full h-full top-0 left-0 -z-10 rounded-2xl bg-white'>
                <video src={getVideoWeather(weatherData.weather[0].icon)} autoPlay loop muted className='object-cover w-[110%] h-full bg-transparent' />
            </div>

        </section>
    )
}

export default TodayWeather
