import { location } from "./api/location";
import { WeatherFetch, type Units } from "./api/weather";
import { Current_Weather } from "./ui/render";
import { DailyForecast } from "./ui/render";
import { HourlyCast , setDay } from "./ui/render";
const form = document.getElementById("searchForm") as HTMLFormElement;
const input = document.getElementById("search") as HTMLInputElement;
const errorEl = document.getElementById("errorMsg") as HTMLElement;
const skeleton = document.getElementById("skeleton") as HTMLElement;


console.log("Skele" , skeleton);


function setError(msg: string) {
  errorEl.textContent = msg;
}
function clearError() {
  errorEl.textContent = "";
}
const main = document.getElementById("main-container") as HTMLElement;

function hideResults() {
  main.classList.add("is-hidden");
}

function showResults() {
  main.classList.remove("is-hidden");
}

function showSkeleton(){
    skeleton.classList.remove("is-hidden");
}

function hideSkeleton(){
    skeleton.classList.add("is-hidden");
}


let units: Units = "metric";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) {
    setError("Please type a city name first.");
    hideSkeleton();
    return;
  }
  hideResults();
  showSkeleton();
  clearError();
  try {
    const locations = await location(query);

    if (!locations.length) {
      setError("No search result found.");
          hideResults();
          hideSkeleton();
      return;
    }

    const loc = locations[0];

    const weather = await WeatherFetch(
      loc.latitude,
      loc.longitude,
      units,
      loc.timezone
    );
    hideSkeleton();
    showResults();
    Current_Weather(loc.name,  loc.country, weather , units);
    DailyForecast(weather ,units);
    let selectedDay = 0;
    HourlyCast(weather,units,selectedDay);
    setDay(weather, units , (dayIndex)=>{
        selectedDay = dayIndex;
        HourlyCast(weather,units,selectedDay);
    });

  } catch (err: any) {
    console.error(err);
    hideResults();
    hideSkeleton();
    setError(err?.message ?? "Something went wrong.");
  }

});
