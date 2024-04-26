// debounce function 
export const myDebounce = (fn: any, delay: number = 400) => {
    let timeoutId: any;

    const debouncedFn = (...args: any) => {
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
    debouncedFn.cancel = () => {
        clearTimeout(timeoutId);
    }
    return debouncedFn;
};

//throttle function 
export const myThrottle = (fn: any, delay: number = 1000) => {
    let prev = 0;
    return (...args: any) => {
        const now = new Date().getTime();
        if (now - prev >= delay) {
            fn(...args);
            prev = now;
        }
    };
}

// convert celsius to fahrenheit and vice versa 
export const toggleUnits = (temperature: number, unitSystem: string) => {
    let roundedTemperature = Math.round(temperature);

    if (unitSystem === 'imperial') {
        const celsiusToFahrenheit = (celsius: number) => (celsius * 9 / 5) + 32;
        roundedTemperature = Math.round(celsiusToFahrenheit(temperature));
    }

    return roundedTemperature;
}

// convert degree to wind direction and m/s or mph
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

// get air quality
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

// get weather image
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


