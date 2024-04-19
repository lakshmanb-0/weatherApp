export interface TypeGeoNames {
    geoname_id: string;
    name: string;
    ascii_name: string;
    alternate_names: string[];
    feature_class: string;
    feature_code: string;
    country_code: string;
    cou_name_en: string;
    admin1_code: string;
    admin2_code: string;
    admin3_code: null;
    admin4_code: null;
    population: number;
    elevation: null;
    dem: number;
    timezone: string;
    modification_date: string;
    label_en: string;
    coordinates: {
        lon: number;
        lat: number;
    };
}


export interface TypeWeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
        temp_kf?: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
        pod?: string;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
    dt_txt?: string;
}


export interface TypeWeatherForecast {
    cod: string;
    message: number;
    cnt: number;
    list: TypeWeatherData[]
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

