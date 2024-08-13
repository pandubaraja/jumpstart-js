import { fetchWeather, fetchWeatherLatLong } from './weatherApi.js';

class WeatherApp {
    constructor() {
        this.searchBtn = document.getElementById('search-btn');
        this.locationBtn = document.getElementById('location-btn')
        this.cityInput = document.getElementById('city-input');
        this.weatherContainer = document.getElementById('weather-container');
        this.historyList = document.getElementById('history-list');

        const localHistories = localStorage.getItem('search_histories')
        this.searchHistory = localHistories ? JSON.parse(localHistories) : [];

        this.init();
    }

    init() {
        this.searchBtn.addEventListener('click', () => this.handleSearch())
        this.locationBtn.addEventListener('click', () => this.handleLocation())
        this.cityInput.addEventListener('keypress', (event) => {
            if(event.key == 'Enter') this.handleSearch()
        })
        this.historyList.addEventListener('click', (event) => this.handleHistoryClick(event))

        const urlParams = new URLSearchParams(window.location.search)
        const cityParam = urlParams.get('city')
        if (cityParam) {
            this.cityInput.value = cityParam
            this.handleSearch()
        }

        this.updateHistoryList()
    }

    handleSearch() {
        const city = this.cityInput.value.trim()

        if (city) {
            this.displayLoading()

            fetchWeather(city)
                .then(data => {
                    this.handleState(data)
                })
        }
    }

    handleState(state) {
        switch (state.state) {
            case 'success': 
                this.displayWeather(state.data)
                this.cityInput.value = state.data.city
                this.addToHistory(state.data.city)
                break;
            case 'error': 
                this.displayError(state.message)
                break;
            default: break
        }
    }

    handleLocation() {
        this.displayLoading()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    fetchWeatherLatLong(lat, lon)
                        .then(state => {
                            this.handleState(state)
                        })
                },
                (error) => {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            this.displayError("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            this.displayError("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            this.displayError("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            this.displayError("An unknown error occurred.");
                            break;
                    }
                },
                {
                    timeout: 5000
                }
            );
        } else {
            this.displayError("Geolocation is not supported by this browser.");
        }
    }

    displayWeather(data) {
        const weatherHTML = `
                <dotlottie-player src="${data.weatherLottie}" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
                <div id='weather-details'>
                    <span class='title-lg'>${data.temperature}º</span>
                    <span class='title-md'>${data.weather}</span>
                    <span class='title-sm'>${data.city}, ${data.country}</span>
                    <ul class='horizontal-info'>
                        <li><i class="fa-solid fa-droplet"></i>${data.humidity}</li>
                        <li><i class="fa-solid fa-wind fa-flip-horizontal"></i>${data.windSpeed}</li>
                        <li><i class="fa-solid fa-water"></i>${data.seaLevel}</li>
                    </ul>
                </div>
        `
        
        this.weatherContainer.innerHTML = weatherHTML
    }

    displayLoading() {
        this.weatherContainer.innerHTML = `<div class='loader'></div>`
    }
    
    displayError(error) {
        this.weatherContainer.innerHTML = `<p>Error: ${error}</p>`
    }

    addToHistory(city) {
        if (this.searchHistory.includes(city)) {
            const index = this.searchHistory.indexOf(city)
            this.searchHistory.splice(index, 1);
            this.searchHistory.unshift(city);
            this.updateHistoryList()
            this.updateURL(city)
            return
        }
        
        this.searchHistory.unshift(city)

        if (this.searchHistory.length > 5) this.searchHistory.pop()

        localStorage.setItem('search_histories', JSON.stringify(this.searchHistory))
        
        this.updateHistoryList()
        this.updateURL(city)
    }

    updateHistoryList() {
        this.historyList.innerHTML = this.searchHistory.map(city => `<li>${city}</li>`).join("")
    }

    handleHistoryClick(e) {
        if (e.target.tagName === 'LI') {
            this.cityInput.value = e.target.textContent
            this.handleSearch()
            this.updateURL(e.target.textContent)
        }
    }

    updateURL(city) {
        const url = new URL(window.location)
        url.searchParams.set('city', city)
        window.history.pushState({}, '', url)
    }
}

new WeatherApp();