import { getBasicWeather, getForecastWeather } from '@/app/actions'
import { ClientWeather } from '@/app/src/components'
import moment from 'moment'
import { revalidatePath } from 'next/cache'
import React from 'react'

const page = async ({ params: { lat, lon } }: { params: { lat: number, lon: number } }) => {
    const metricWeatherData = await getBasicWeather({ lat, lon }, 'metric')
    const metricForecastData = await getForecastWeather({ lat, lon }, 'metric')

    if (!metricWeatherData.coord && !metricForecastData.list[0].coord) {
        return <div className='text-red-500'>Not found</div>
    }
    let newDate = moment();
    let previousDate = moment(metricWeatherData.dt * 1000);
    let diffInMilliseconds = newDate.diff(previousDate);

    // revalidate after 20 minutes 
    if (diffInMilliseconds > 20 * 60 * 1000) {
        revalidatePath(`/weather/${lat}/${lon}`)
    }

    return (
        <ClientWeather
            weatherData={metricWeatherData}
            forecastData={metricForecastData}
        />
    )
}

export default page