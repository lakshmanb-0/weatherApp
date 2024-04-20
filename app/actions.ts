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

export const getVideoWeather = async (IconCode: string) => {
    let videoId = 0;
    switch (IconCode) {
        case "01d":
            videoId = 1542008;
            break;
        case "01n":
            videoId = 905250;
            break;
        case "02d":
            videoId = 5288342;
            break;
        case "02n":
            videoId = 6601416;
            break;
        case "03d":
        case "04d":
            videoId = 5262509;
            break;
        case "03n":
        case "04n":
            videoId = 6960047;
            break;
        case "09d":
        case "10d":
            videoId = 5100156;
            break;
        case "09n":
        case "10n":
            videoId = 1484703;
            break;
        case "11d":
            videoId = 6190836;
            break;
        case "11n":
            videoId = 5908584;
            break;
        case "13d":
            videoId = 1856985;
            break;
        case "13n":
            videoId = 6527135;
            break;
        case "50d":
        case "50n":
            videoId = 1779202;
            break;
        default:
            videoId = 1542008;
    }
    const res = await fetch(`https://api.pexels.com/videos/videos/${videoId}`, {
        headers: {
            'Authorization': process.env.NEXT_PEXELS_APP_KEY as string,
            'Content-Type': 'application/json',
        },
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await res.json();
    const link = data.video_files.find((file: any) => file.width === 1280).link
    return link;
}