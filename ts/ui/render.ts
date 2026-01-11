import { Units, WeatherLoader } from "../api/weather";
import { GetWeatherIcon } from "../utils/WeatherIcons";
const City = document.getElementById("city-location") as HTMLElement;
const currentDate = document.getElementById("date") as HTMLElement;
const currentTemp = document.getElementById("current-temp") as HTMLElement;
const Icon = document.getElementById("current-icon") as HTMLElement | null;
const feelsLike = document.getElementById("feels-like") as HTMLElement;
const Humidity = document.getElementById("humidity") as HTMLElement;
const windSpeed = document.getElementById("wind-speed") as HTMLElement;
const Precipitation = document.getElementById("prec-value") as HTMLElement;



export function Current_Weather(city :string , country:string , weather:WeatherLoader , units : "metric" | "imperial"){
    City.textContent = country ? `${city} , ${country}` : city;
    const date =  new Date(weather.current.time);
    currentDate.textContent = date.toLocaleDateString("en-US" ,{
        weekday:"long",
        month:"short",
        day:"numeric",
        year:"numeric"
    });
    const Unit_Symbole = units === "imperial" ? "°" : "°"
    currentTemp.textContent = `${Math.round(weather.current.temperature)}${Unit_Symbole}`;
    feelsLike.textContent = `${Math.round(weather.current.apparentTemperature)}${Unit_Symbole}`
    if (Icon)
        Icon.setAttribute("src" , GetWeatherIcon(weather.current.weatherCode));
    Humidity.textContent=`${weather.current.humidity}%`;
    windSpeed.textContent = units === "imperial" ? `${Math.round(weather.current.windSpeed)}mph`: `${Math.round(weather.current.windSpeed)} km/h`
    Precipitation.textContent = units === "imperial" ? `${weather.current.precipitation}in` : `${weather.current.precipitation} mm`
}



const Daily_Container = document.getElementById("daily-container") as HTMLElement;

function FormatDay(dateDay:string){
    const Day_Date = new Date(dateDay);
    return Day_Date.toLocaleDateString("en-US" , {weekday:"short"});
}

export function DailyForecast(weather:WeatherLoader, units:"metric" |"imperial"){
    Daily_Container.innerHTML = "";

    for(let i = 0; i< weather.daily.time.length;i++){
        const day = FormatDay(weather.daily.time[i]);
        const max = Math.round(weather.daily.tempMax[i]);
        const min = Math.round(weather.daily.tempMin[i]);

        const Icon = GetWeatherIcon(weather.daily.weatherCode[i]);

        //Create Div Container For DailyCast
        const item = document.createElement("div");
        item.className = "day-to-day";
        item.dataset.DayIndex = String(i);
        
        //Create Header For The Section and Add it to the parent item
        const Daily_Header = document.createElement("span")
        Daily_Header.className="daily-header";
        Daily_Header.textContent = `${day}`
        item.appendChild(Daily_Header);
        //Create Image for Section and add it to the Parent Item
        const image = document.createElement("img");
        image.className="daily-img"
        image.setAttribute("src" , Icon);
        item.appendChild(image);
        //Create Wrapper For the max and min temp
        const temp_wrapper = document.createElement("span")
        temp_wrapper.className = "temp-wrapper";
        const max_temp = document.createElement("span")
        const min_temp = document.createElement("span")
        max_temp.className = "temp";
        min_temp.className = "temp";
        max_temp.classList.add("max-temp")
        max_temp.textContent= `${max.toString()}°`;
        min_temp.textContent= `${min.toString()}°`;

        temp_wrapper.appendChild(max_temp);
        temp_wrapper.appendChild(min_temp);
        item.appendChild(temp_wrapper);
        //Add Item For the Container
        Daily_Container.appendChild(item);
    }
}



function FormatHour(isoTime:string){
    const hour_date = new Date(isoTime);
    return hour_date.toLocaleTimeString("en-US",{hour:"numeric"});
}



export function HourlyCast(weather:WeatherLoader , units:Units , DayIndex:number){
    const hourly_container = document.getElementById("hourly-container") as HTMLElement
    if (!hourly_container)
        return;
    hourly_container.innerHTML = "";

    const Day_Start = weather.daily.time[DayIndex];
    const Start_index = weather.hourly.time.findIndex((t)=>t.startsWith(Day_Start));

    const endIndex = Math.min(Start_index + 24, weather.hourly.time.length);
    for (let i = Start_index;i<endIndex;i++){
        const hour = FormatHour(weather.hourly.time[i]);
        const temp = Math.round(weather.hourly.temperature[i]);

        const Icon = GetWeatherIcon(weather.hourly.weatherCode[i])

        const ParentItem = document.createElement("div");
        ParentItem.className = "temp-hour";

        const image = document.createElement("img");
        image.className = "daily-temp-img";
        image.setAttribute("src" , Icon);
        ParentItem.appendChild(image);

        const Hourly_hour = document.createElement("span");
        Hourly_hour.className = "hour";
        Hourly_hour.textContent = `${hour}`;

        ParentItem.appendChild(Hourly_hour);

        const temp_hourly = document.createElement("span");
        temp_hourly.className = "temp-hourly";
        temp_hourly.textContent = `${temp}°`
        ParentItem.appendChild(temp_hourly);
        hourly_container.appendChild(ParentItem)
    }
}
    


export function setDay(weather:WeatherLoader,units:Units, ChangeDay:(dayIndex:number)=>void){
        const toggle = document.getElementById("todayToggle") as HTMLButtonElement;
        const menu = document.getElementById("todayMenu") as HTMLElement;
        const current_day = document.getElementById("currentDay") as HTMLElement;

        if (!toggle || !menu || !current_day)
            return;
        menu.innerHTML = "";

        weather.daily.time.forEach((str_Date , indx)=>{
            const dayName = new Date(str_Date).toLocaleDateString("en-US" , {weekday:"long"});

            const wrap = document.createElement("div");
            wrap.className = "today-section";


            const btn = document.createElement("button");
            btn.className ="today-option";
            btn.type = "button";
            btn.dataset.dayIndex = String(indx);
            btn.textContent = indx ===0 ? "Today":dayName;
            btn.addEventListener("click" , ()=>{
                current_day.textContent = indx === 0 ? "Today": dayName;
                menu.classList.remove("open");
                ChangeDay(indx);
            });
            wrap.appendChild(btn);
            menu.appendChild(wrap);
        });
        toggle.addEventListener("click",()=>{
            menu.classList.toggle("open");
        });
        document.addEventListener("click" , (e)=>{
            const target = e.target as HTMLElement;
            if(!target.closest(".today-dropdown"))
                menu.classList.remove("open");
        });
    }


    const toggle = document.getElementById('unitToggle') as HTMLElement;
    const menu = document.getElementById('unitMenu') as HTMLElement;

  let selectedUnit = 'c';

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.unit-option').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedUnit = btn.dataset.unit;
      selectedUnit
      console.log('Selected unit:', selectedUnit);

      menu.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.unit-dropdown')) {
      menu.classList.remove('open');
    }
  });  
