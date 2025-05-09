import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
  constructor(private httpClient: HttpClient) {}

  getWeather(location: string, hikeDate: Date): Observable<any | null>{
    const now = new Date();
    const timeDiffInMs = hikeDate.getTime() - now.getTime();
    const maxForecastRangeMs = 5 * 24 * 60 * 60 * 1000;
  
    if (timeDiffInMs > maxForecastRangeMs || timeDiffInMs < 0) {
      return of(null);
    }
  
    return this.httpClient
      .get<any>("https://api.openweathermap.org/data/2.5/forecast?q=" + location +"&appid=" + environment.weatherMap.apiKey + "&units=metric")
      .pipe(
        map(response => {
          const list = response.list;
  
          const closest = list.reduce((prev: any, curr: any) => {
            const prevDiff = Math.abs(new Date(prev.dt_txt).getTime() - hikeDate.getTime());
            const currDiff = Math.abs(new Date(curr.dt_txt).getTime() - hikeDate.getTime());
            return currDiff < prevDiff ? curr : prev;
          });
  
          return {
            cityName: response.city?.name,
            forecast: closest
          };
        })
      );
  }
}
