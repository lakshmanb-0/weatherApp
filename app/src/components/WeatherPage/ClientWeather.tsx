'use client'
import React, { FC, useEffect } from 'react'
import { Navbar, Forecast, TodayWeather, WeatherCategory, Sunrise } from '../index'
import { TypeWeatherData, TypeWeatherForecast } from '@/app/src/types';
import { useDispatch } from 'react-redux';
import { addLocalStorage, addPreviousLocation } from '@/app/src/store/dataSlice';
import { createClient } from 'pexels';

type Props = {
    weatherData: TypeWeatherData,
    forecastData: TypeWeatherForecast,
    videoUrl: string
}

const ClientWeather: FC<Props> = ({ weatherData, forecastData, videoUrl }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(addLocalStorage())
        if (weatherData.coord.lat && weatherData.coord.lon) {
            let data = {
                lat: weatherData.coord.lat,
                lon: weatherData.coord.lon,
                cityName: weatherData.name,
                country: weatherData.sys.country,
                favorite: false,
                temp: weatherData.main.temp,
                weatherDescription: weatherData.weather[0].description
            }
            dispatch(addPreviousLocation(data))
        }
    }, [weatherData.coord.lat, weatherData.coord.lon])

    return (
        <section className='h-screen w-full p-4 sm:p-7 max-Width'>
            <Navbar weatherData={weatherData} />
            <div className='grid md:grid-cols-2 gap-7 py-5 w-full'>
                <div >
                    <TodayWeather weatherData={weatherData} videoUrl={videoUrl} />
                    <WeatherCategory weatherData={weatherData} />
                    <Sunrise weatherData={weatherData} />
                </div>
                <div >
                    <Forecast forecastData={forecastData} />
                </div>
            </div>
        </section>
    )
}

export default ClientWeather

