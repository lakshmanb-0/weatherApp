'use client'
import { getAirCondition } from '@/app/actions';
import { RootState } from '@/app/store/store';
import { TypeWeatherData } from '@/app/types'
import { airQuality, toggleWind } from '@/app/utils/utils';
import React, { FC, useEffect, useState } from 'react'
import { LuWind, LuEye } from "react-icons/lu";
import { MdOutlineWaterDrop } from "react-icons/md";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { useSelector } from 'react-redux';

const WeatherCategory: FC<{ weatherData: TypeWeatherData }> = ({ weatherData }) => {
    const unitSystem = useSelector((state: RootState) => state.units);
    const [airCondition, setAirCondition] = useState<number>(0)

    // get air condition
    useEffect(() => {
        const fetchAir = async (lat: number, lon: number) => {
            let airCondition = await getAirCondition({ lat, lon }, 'imperial')
            setAirCondition(airCondition.main.aqi)
        }
        fetchAir(weatherData.coord.lat, weatherData.coord.lon)
    })

    const categoriesData = [
        {
            title: 'Air Quality',
            icon: TiWeatherWindyCloudy,
            content: airQuality(airCondition) ?? 0
        },
        {
            title: 'Wind',
            icon: LuWind,
            content: toggleWind(weatherData.wind.speed, weatherData.wind.deg, unitSystem),
        },
        {
            title: 'Humidity',
            icon: MdOutlineWaterDrop,
            content: `${weatherData.main.humidity}%`,
        },
        {
            title: 'Visibility',
            icon: LuEye,
            content: `${weatherData.visibility / 1000} km`,
        },
        {
            title: 'Pressure',
            content: `${weatherData.main.pressure} hpa`,
        },
        {
            title: 'Ground Level',
            content: `${weatherData.main.grnd_level} hpa`,
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 py-5">
            {categoriesData.map((item: any, index) => (
                <div key={index} className="p-5 bg-white dark:bg-darkBlue rounded-2xl flex gap-4">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                        <p className="dark:text-darkGray">{item.title}</p>
                        <p className="text-darkBlue dark:text-white font-semibold text-base sm:text-xl">{item.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeatherCategory;
