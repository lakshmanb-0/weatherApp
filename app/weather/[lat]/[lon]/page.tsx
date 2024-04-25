import { getBasicWeather, getForecastWeather, getVideoWeather } from '@/app/actions'
import { ClientWeather } from '@/app/src/components'
import moment from 'moment'
import { revalidateTag } from 'next/cache'
import React from 'react'

const page = async ({ params: { lat, lon } }: { params: { lat: number, lon: number } }) => {
    const WeatherData = getBasicWeather({ lat, lon }, 'metric')
    const ForecastData = getForecastWeather({ lat, lon }, 'metric')

    // parallel requests for weather and forecast data
    const [metricWeatherData, metricForecastData] = await Promise.all([WeatherData, ForecastData])

    if (!metricWeatherData?.coord && !metricForecastData?.list?.[0]?.coord) {
        return <div className='text-red-500 w-full grid place-items-center h-screen text-center text-xl px-2'>{`Something's wrong!`} <br />{` Please check your network`}.</div>
    }

    // revalidate after 20 minutes
    const reValidate = () => {
        let newDate = moment();
        let previousDate = moment(metricWeatherData.dt * 1000);
        let diffInMilliseconds = newDate.diff(previousDate);

        const today = moment().startOf('day');
        const prevDate = moment(metricWeatherData.dt * 1000).startOf('day');

        if (diffInMilliseconds > 20 * 60 * 1000 || today.diff(prevDate, 'days') > 0) {
            revalidateTag('weather');
        }
    }
    reValidate();

    //video Api 
    const videoUrl = await getVideoWeather(metricWeatherData.weather[0].icon);

    return (
        <ClientWeather
            weatherData={metricWeatherData}
            forecastData={metricForecastData}
            videoUrl={videoUrl}
        />
    )
}

export default page