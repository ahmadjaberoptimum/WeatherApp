export type Units = "metric" | "imperial";

export type WeatherLoader = {
    timezone : string;
    current:{
        time:string;
        temperature:number;
        apparentTemperature:number;
        humidity:number;
        windSpeed:number;
        precipitation:number;
        weatherCode:number;
    };
    daily:{
        time:string[];
        weatherCode:number[];
        tempMax:number[];
        tempMin:number[];
    }
    hourly:{
        time:string[];
        temperature:number[];
        precipitation:number[];
        weatherCode:number[];
    }
};

type APIResponse={
    timezone:string;
    current:{
        time:string;
        temperature_2m:number;
        apparent_temperature:number;
        relative_humidity_2m:number;
        wind_speed_10m:number;
        precipitation:number;
        weather_code:number;
    };
    daily:{
        time:string[];
        weather_code:number[];
        temperature_2m_max:number[];
        temperature_2m_min:number[];
    }
    hourly:{
        time:string[];
        temperature_2m:number[];
        precipitation:number[];
        weather_code:number[];
    }
}


function buildUrl(latitude:number,longitude:number,units:Units,timezone?:string):string{
    const temperature_unit = units === "imperial" ? "fahrenheit" : "celsius";
    const windspeed_unit = units === "imperial" ? "mph" : "kmh";
    const precipitation_unit = units==="imperial" ? "inch" : "mm";
    const time_zone = timezone ?? "auto";

    return (
        `https://api.open-meteo.com/v1/forecast` + 
        `?latitude=${latitude}` +
        `&longitude=${longitude}` + 
        `&timezone=${encodeURIComponent(time_zone)}` +
        `&temperature_unit=${temperature_unit}` + 
        `&windspeed_unit=${windspeed_unit}` +
        `&precipitation_unit=${precipitation_unit}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code`+
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&hourly=temperature_2m,precipitation,weather_code` +
        `&forecast_days=7`
    );
}


export async function WeatherFetch(latitude:number , longitude:number,units:Units , timezone?:string) : Promise<WeatherLoader>{
    const URL = buildUrl(latitude,longitude,units,timezone);
    const Response = await fetch(URL);

    if(!Response.ok)
        throw new Error(`Weather Request Failed (HTTP${Response.status})`);
    const Data:APIResponse = await Response.json();
    return {
        timezone:Data.timezone,
        current:{
            time:Data.current.time,
            temperature:Data.current.temperature_2m,
            apparentTemperature:Data.current.apparent_temperature,
            humidity:Data.current.relative_humidity_2m,
            windSpeed:Data.current.wind_speed_10m,
            precipitation:Data.current.precipitation,
            weatherCode:Data.current.weather_code
        },
        daily:{
            time:Data.daily.time,
            weatherCode:Data.daily.weather_code,
            tempMax:Data.daily.temperature_2m_max,
            tempMin:Data.daily.temperature_2m_min
        },
        hourly:{
            time:Data.hourly.time,
            temperature:Data.hourly.temperature_2m,
            precipitation:Data.hourly.precipitation,
            weatherCode:Data.hourly.weather_code
        }
    }
}

