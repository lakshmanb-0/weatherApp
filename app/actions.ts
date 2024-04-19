'use server'

export const getGeoNames = async (filter: string) => {
    try {
        const response = await fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=name%2Ccoordinates%2Cgeoname_id%2Ctimezone%2Cascii_name%2Ccou_name_en%2Ccountry_code%2Cpopulation%2Clabel_en${filter}`);
        let data = await response.json();
        return data
    } catch (error) {
        return error;
    }
}

export const getSearchData = async (filter: string) => {
    try {
        const response = await fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=name%2Ccoordinates%2Ccou_name_en&limit=10&where=search(name%2C"${filter}")`)
        let data = await response.json();
        return data.results
    } catch (error) {
        return error;
    }
}

export const getForecastWeather = async (coordinates: { lat: number, lon: number }, units: string) => {
    let data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&&appid=${process.env.NEXT_WEATHER_APP_KEY}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            return data
        }).catch(error => {
            console.log(error)
        })
    return data
}
export const getBasicWeather = async (coordinates: { lat: number, lon: number }, units: string) => {
    let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&&appid=${process.env.NEXT_WEATHER_APP_KEY}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            return data
        }).catch(error => {
            console.log(error)
        })
    return data
}

export const getAirCondition = async (coordinates: { lat: number, lon: number }, units: string) => {
    let data = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&&appid=${process.env.NEXT_WEATHER_APP_KEY}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            return data.list[0]
        }).catch(error => {
            console.log(error)
        })
    return data
}