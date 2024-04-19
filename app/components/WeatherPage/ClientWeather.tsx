'use client'
import React, { FC, useEffect } from 'react'
import { Navbar, Forecast, TodayWeather, WeatherCategory, Sunrise } from '../index'
import { TypeWeatherData, TypeWeatherForecast } from '@/app/types';
import { useDispatch } from 'react-redux';
import { addLocalStorage, addPreviousLocation } from '@/app/store/dataSlice';

type Props = {
    weatherData: TypeWeatherData,
    forecastData: TypeWeatherForecast
}

const ClientWeather: FC<Props> = ({ weatherData, forecastData }) => {
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
    }, [])


    return (
        <section className='h-screen w-full p-4 sm:p-7'>
            <Navbar weatherData={weatherData} />
            <div className='grid sm:grid-cols-2 gap-7 py-5 w-full'>
                <div >
                    <TodayWeather weatherData={weatherData} />
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

