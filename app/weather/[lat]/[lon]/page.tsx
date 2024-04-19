import { getBasicWeather, getForecastWeather } from '@/app/actions'
import { ClientWeather } from '@/app/src/components'
import React from 'react'

const page = async ({ params: { lat, lon } }: { params: { lat: number, lon: number } }) => {
    const metricWeatherData = await getBasicWeather({ lat, lon }, 'metric')
    const metricForecastData = await getForecastWeather({ lat, lon }, 'metric')

    if (!metricWeatherData.coord && !metricForecastData.list[0].coord) {
        return <div className='text-red-500'>Not found</div>
    }
    return (
        <ClientWeather
            weatherData={metricWeatherData}
            forecastData={metricForecastData}
        />
    )
}

export default page