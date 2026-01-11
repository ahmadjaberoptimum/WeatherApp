export type LocationResult ={
    name:string;
    country?:string;
    admin1?:string;
    latitude:number;
    longitude:number;
    timezone?:string;
};

type LocationResponse = {
    results?:Array<{
        name:string;
        country?:string;
        admin1?:string;
        latitude:number;
        longitude:number;
        timezone?:string;
    }>;
};


export async function location(name:string): Promise<LocationResult[]>{
    const q = name.trim();
    if(!q) 
        return [];
    const URL = `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
    const Response = await fetch(URL);
    if(!Response.ok)
        throw new Error("Location Faild");

    const Data:LocationResponse = await Response.json();
    const Results  = Data.results ?? []; 

    return Results.map((r) =>({
        name : r.name,
        country : r.country,
        admin1 : r.admin1,
        latitude: r.latitude,
        longitude : r.longitude,
        timezone : r.timezone
    }));
}