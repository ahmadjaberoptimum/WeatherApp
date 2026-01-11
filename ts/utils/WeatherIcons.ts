export function GetWeatherIcon(code:number):string{
    const sunny = "images/main/day-forecast-section/icon-sunny.webp";
    const partly = "images/main/day-forecast-section/icon-partly-cloudy.webp";
    const overcast = "images/main/day-forecast-section/icon-overcast.webp";
    const fog = "images/main/day-forecast-section/icon-fog.webp";
    const drizzle = "images/main/day-forecast-section/icon-drizzle.webp";
    const rain = "images/main/day-forecast-section/icon-rain.webp";
    const snow = "images/main/day-forecast-section/icon-snow.webp";
    const storm = "images/main/day-forecast-section/icon-storm.webp";


    switch(code){
        case 0:
            return sunny;
        case 1:
        case 2:
            return partly;
        case 3:
            return overcast;
        case 45:
        case 48:
            return fog;
        case 51:
        case 53:
        case 55:
        case 57:
            return drizzle;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
            return rain;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return snow;
        case 80:
        case 81:
        case 82:
            return rain;
        case 95:
        case 96:
        case 99:
            return storm;

        default:
            return partly;

        }


}