'use client'
import { getAirCondition } from '@/app/actions';
import { RootState } from '@/app/src/store/store';
import { TypeWeatherData } from '@/app/src/types'
import { airQuality, toggleUnits, toggleWind } from '@/app/src/utils/utils';
import React, { FC, useEffect, useState } from 'react'
import { LuWind, LuEye } from "react-icons/lu";
import { MdOutlineWaterDrop } from "react-icons/md";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import { FaTemperatureHigh } from "react-icons/fa";
import { TbCircuitGround } from "react-icons/tb";
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
    }, [])

    const categoriesData = [
        {
            title: 'Air Quality',
            icon: TiWeatherWindyCloudy,
            value: airQuality(airCondition),
            endValue: '',

        },
        {
            title: 'Wind',
            icon: LuWind,
            value: toggleWind(weatherData.wind.speed, weatherData.wind.deg, unitSystem),
            endValue: unitSystem === 'metric' ? 'm/s' : 'mph',
        },
        {
            title: 'Humidity',
            icon: MdOutlineWaterDrop,
            value: weatherData.main.humidity,
            endValue: '%',
        },
        {
            title: 'Visibility',
            icon: LuEye,
            value: weatherData.visibility / 1000,
            endValue: 'km',
        },
        {
            title: 'Pressure',
            icon: TbCircuitGround,
            value: weatherData.main.pressure,
            endValue: 'hpa',
        },
        {
            title: 'Temperature',
            icon: FaTemperatureHigh,
            value: toggleUnits(weatherData.main.temp_min, unitSystem) + ' - ' + toggleUnits(weatherData.main.temp_max, unitSystem),
            endValue: unitSystem === 'metric' ? '°C' : '°F',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 py-5">
            {categoriesData.map((item: any, index) => !!item.value && (
                <div key={index} className="p-5 bg-white dark:bg-darkBlue rounded-2xl flex gap-4">
                    <item.icon size={20} className='mt-1' />
                    <div>
                        <p className="dark:text-darkGray">{item.title}</p>
                        <p className="text-darkBlue dark:text-white font-semibold text-base sm:text-lg">{item.value} {item.endValue}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeatherCategory;
