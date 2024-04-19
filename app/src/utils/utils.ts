
export const toggleUnits = (temperature: number, unitSystem: string) => {
    let roundedTemperature = Math.round(temperature);

    if (unitSystem === 'imperial') {
        const celsiusToFahrenheit = (celsius: number) => (celsius * 9 / 5) + 32;
        roundedTemperature = Math.round(celsiusToFahrenheit(temperature));
    }

    return roundedTemperature;
}

export const toggleWind = (wind: number, degree: number, unitSystem: string) => {
    let windDirection = calculateWindDirection(degree);
    if (unitSystem === 'imperial') {
        return windDirection + ' ' + (wind * 2.23694).toFixed(2);
    }
    return windDirection + ' ' + wind
}

export const calculateWindDirection = (degrees: number) => {
    const windDirections = [
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ];

    const directionIndex = Math.floor((degrees / 22.5) + 0.5) % 16;
    return windDirections[directionIndex];
}

export const airQuality = (aqi: number) => {
    switch (aqi) {
        case 0:
            return 'Good'
        case 1:
            return 'Fair'
        case 2:
            return 'Moderate'
        case 3:
            return 'Poor'
        case 4:
            return 'Very Poor'
        default:
            return 'Unknown'
    }
}
export const getImageWeather = (IconCode: string) => {
    switch (IconCode) {
        case "01d":
            return '/day.svg'
        case "01n":
            return '/night.svg'
        case "02d":
            return '/cloudy-day-1.svg'
        case "02n":
            return '/cloudy-night-1.svg'
        case "03d":
            return '/cloudy-day-3.svg'
        case "03n":
            return '/cloudy-night-3.svg'
        case "04d":
        case "04n":
            return '/cloudy.svg'
        case "09d":
            return '/rainy-1.svg'
        case "09n":
            return '/rainy-5.svg'
        case "10d":
            return '/rainy-3.svg'
        case "10n":
            return '/rainy-6.svg'
        case "11d":
        case "11n":
            return '/thunder.svg'
        case "13d":
            return '/snowy-3.svg'
        case "13n":
            return '/snowy-6.svg'
        case "50d":
            return '/day.svg'
        case "50n":
            return '/night.svg'
        default:
            return '/day.svg'
    }
}
export const getVideoWeather = (IconCode: string) => {
    switch (IconCode) {
        case "01d":
            return 'https://videos.pexels.com/video-files/5304549/5304549-uhd_3840_2160_30fps.mp4'
        case "01n":
            return 'https://videos.pexels.com/video-files/905250/905250-hd_1920_1080_30fps.mp4'
        case "02d":
            return 'https://videos.pexels.com/video-files/5288342/5288342-hd_1920_1080_30fps.mp4'
        case "02n":
            return 'https://videos.pexels.com/video-files/6601416/6601416-hd_1920_1080_30fps.mp4'
        case "03d":
        case "04d":
            return 'https://videos.pexels.com/video-files/2935032/2935032-uhd_3840_2160_30fps.mp4'
        case "03n":
        case "04n":
            return 'https://videos.pexels.com/video-files/6960047/6960047-hd_1920_1080_30fps.mp4'
        case "09d":
        case "10d":
            return 'https://videos.pexels.com/video-files/5100156/5100156-hd_1920_1080_30fps.mp4'
        case "09n":
        case "10n":
            return 'https://videos.pexels.com/video-files/5197762/5197762-uhd_3840_2160_25fps.mp4'
        case "11d":
            return 'https://videos.pexels.com/video-files/6190836/6190836-hd_1920_1080_30fps.mp4'
        case "11n":
            return 'https://videos.pexels.com/video-files/5908584/5908584-hd_1920_1080_25fps.mp4'
        case "13d":
            return 'https://videos.pexels.com/video-files/6471377/6471377-uhd_4096_2160_24fps.mp4'
        case "13n":
            return 'https://videos.pexels.com/video-files/6933752/6933752-uhd_4096_2160_24fps.mp4'
        case "50d":
        case "50n":
            return 'https://videos.pexels.com/video-files/3028395/3028395-uhd_3840_2160_24fps.mp4'
        default:
            return 'https://videos.pexels.com/video-files/5304549/5304549-uhd_3840_2160_30fps.mp4'
    }
}

