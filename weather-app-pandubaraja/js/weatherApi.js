import { ENV } from './env.js'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const WeatherType = Object.freeze ({
    THUNDERSTORM: 'Thunderstorm',
    RAIN: 'Rain',
    DRIZZLE: 'Drizzle',
    SNOW: 'Snow',
    CLEAR: 'Clear',
    CLOUDS: 'Clouds'
})

export class Weather {
    
    constructor(data) {
        const weather = data.weather[0]

        this.city = data.name
        this.country = data.sys.country
        this.temperature = Math.round(data.main.temp - 273.15)
        this.weather = this.capitalizeWords(weather.description)
        this.humidity = data.main.humidity
        this.windSpeed = data.wind.speed
        this.seaLevel = data.main.sea_level
        this.weatherLottie = this.getLottie(weather.main)
        this.weatherIcon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    }

    getLottie(weather) {
        switch (weather) {
            case WeatherType.THUNDERSTORM:
                return "https://lottie.host/c04be981-6c2e-4150-b9bd-22e6065da9ee/774AcxrUQg.json"
            case WeatherType.RAIN:
                return "https://lottie.host/f2acfd89-c93f-4f60-84f2-23919c7af2e6/PDWq1Q97RJ.json"
            case WeatherType.DRIZZLE:
                return "https://lottie.host/f2acfd89-c93f-4f60-84f2-23919c7af2e6/PDWq1Q97RJ.json"
            case WeatherType.SNOW:
                return "https://lottie.host/c9eced40-3d2f-4ded-b004-a79ceacc76d1/vUowqhEFtd.json"
            case WeatherType.CLEAR:
                return "https://lottie.host/af67714c-f912-40a9-9ee4-c1ab8ce737be/ddtjRUuacf.json"
            case WeatherType.CLOUDS:
                return "https://lottie.host/4273c15b-9e85-4ed7-8b22-bccfae4b3a77/hgrFpWNPUy.json"
            default: return "https://lottie.host/4d25adc5-cc0b-44b4-a5ef-e413782dbe3f/mbiJVPGOQe.json"
        }
    }

    capitalizeWords(string) {
        return string.split(' ').map(word => {
            if (!word) return ''; 
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
}

export function fetchWeather(city) {
  return fetch(buildUrl(BASE_URL, {q: city}))
    .then(handleWeatherResponse)
    .catch(handleError);
}

export function fetchWeatherLatLong(lat, lon) {
    return fetch(buildUrl(BASE_URL, {
        lat: lat,
        lon: lon
      }))
      .then(handleWeatherResponse)
      .catch(handleError);
}

function buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl);

    url.searchParams.append('appId', ENV.WEATHER_API_KEY)
    
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });
    
    return url.toString();
}

function handleWeatherResponse(response) {
    if (!response.ok) {
        return { state: 'error', code:response.status, message: response.statusText }
    }

    return response.json()
        .then(data => {
          return {
              state: 'success',
              data: new Weather(data)
          }
      })
}

function handleError(error) {
    return { state: 'error', code: error.status, message: error.message };
}