'use client'
import { RootState } from '@/app/store/store'
import { TypeWeatherData, TypeWeatherForecast } from '@/app/types'
import { getImageWeather, toggleUnits, toggleWind } from '@/app/utils/utils'
import moment from 'moment'
import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

type Props = {
    forecastData: TypeWeatherForecast,
}

const Forecast: FC<Props> = ({ forecastData }) => {
    const [forecastDays, setForecastDays] = useState<string[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>(
        moment(forecastData.list[0].dt_txt).format('dddd')
    );

    // Get unique days from forecast data
    useEffect(() => {
        const uniqueDays = Array.from(new Set(forecastData.list.map(item => moment(item.dt_txt).format('dddd'))));
        setForecastDays(uniqueDays);
    }, []);

    // Handle day selection and update selectedDay state
    const onDaySelect = (day: string) => {
        setSelectedDay(day);
    };

    return (
        <section className='bg-white dark:bg-darkBlue p-4 rounded-2xl w-full'>
            <DayList forecastDays={forecastDays} selectedDay={selectedDay} onDaySelect={onDaySelect} />
            <ForecastList forecastData={forecastData} selectedDay={selectedDay} />
        </section>
    );
};

// Component for displaying the forecast days list
const DayList = ({ forecastDays, selectedDay, onDaySelect }: { forecastDays: string[], selectedDay: string, onDaySelect: (day: string) => void }) => (
    <ul className='flex flex-wrap justify-center gap-3 py-5'>
        {forecastDays.map((day, index) => (
            <li
                key={index}
                onClick={() => onDaySelect(day)}
                className={`${selectedDay === day ? 'text-skyBlue' : 'text-darkGray'} cursor-pointer`}
            >
                {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day}
            </li>
        ))}
    </ul>
);

// Component for displaying the forecast for the selected day
const ForecastList = ({ forecastData, selectedDay }: { forecastData: TypeWeatherForecast, selectedDay: string }) => (
    <div>
        {forecastData.list?.map((item: TypeWeatherData, index: number) =>
            moment(item.dt_txt).format('dddd') === selectedDay && (
                <ForecastItem item={item} key={index} />
            )
        )}
    </div>
);

// Component for displaying a single forecast item
const ForecastItem = ({ item }: { item: TypeWeatherData }) => {
    const { main, weather, wind } = item;
    const { speed, deg } = wind;
    const { units } = useSelector((state: RootState) => state);

    return (
        <div className='grid grid-cols-2 items-center gap-2 border-b-[1px] border-lightGray/20 py-4 px-2 last:border-0'>
            <div className='flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 border-r-[1px] border-lightGray/20 sm:px-4'>
                <Image src={getImageWeather(weather[0].icon)} alt={item.weather[0].main} width={50} height={50} className='size-14' />
                <div>
                    <p>{moment(item.dt_txt).format('hh A')}</p>
                    <p className='capitalize'>{item.weather[0].description}</p>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-around gap-2 sm:px-4'>
                <div className='flex gap-1'>
                    <h1 className='text-5xl tracking-wide font-semibold text-darkBlue dark:text-white'>{toggleUnits(main.temp, units)}</h1>
                    <span className='text-sm'>{units === 'metric' ? '°C' : '°F'}</span>
                </div>
                <div className='text-sm dark:text-darkGray text-center space-y-2'>
                    <p>Wind: {toggleWind(speed, deg, units)} {units === 'metric' ? 'm/s' : 'mph'}</p>
                    <p>Humidity: {main.humidity} %</p>
                </div>
            </div>
        </div>
    );
};

export default Forecast;

