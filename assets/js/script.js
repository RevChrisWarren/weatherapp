var userFormEl = document.querySelector("#user-form");
var cityEl = document.querySelector("#city");
var forecastContainerEl = document.querySelector("#weatherdata");
var currentWeatherContainer = document.getElementById("current");
var forecastWeatherContainer = document.getElementById("forecast");

var formSubmitHandler = function (event) {
    console.log(cityEl);
    //prevent page from refreshing
    event.preventDefault();

    //get value from input element
    var cityName = cityEl.value.trim();
    if (cityName) {
        getCityGeo(cityName);

        //clear old content
        forecastContainerEl = "";
        cityEl.value = "";
    } else {
        alert("Please enter a city name")
    }
};

function getCityGeo(city) {
    console.log(cityEl);
    //find the latitude and longitude for the city
    var apiUrlGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=8d03dfd7dbf3df23ffe6a5d84a5e5242";

    fetch(apiUrlGeo)
        .then(function (response) {
            //if request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    var currentCity = data[0].name;
                    var todayDate = moment().format("MM/DD/YYYY");
                    var currentCityDateEl = document.createElement("h2")
                    var iconDay = dailyData.weather[0].icon;
                    var iconToday = `<img src="http://openweathermap.org/img/wn/${iconDay}@2x.png">`;
                    currentCityDateEl.textContent = currentCity + " " + todayDate + " " + iconToday;
                    currentWeatherContainer.textContent = "";
                    currentWeatherContainer.append(currentCityDateEl);
                    console.log(data[0].lat, data[0].lon);
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    var forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=8d03dfd7dbf3df23ffe6a5d84a5e5242`
                    console.log('forecastUrl: ', forecastUrl);
                    fetch(forecastUrl)
                        .then(function (res) {
                            res.json().then(function (forecastData) {
                                // Current Weather Data
                                console.log(forecastData);
                                //calculate kelvin temperaqture into fahrenheit (0K − 273.15) × 9/5 + 32 = -459.7°F
                                var temp = ((forecastData.current.temp - 273.15) * 9 / 5 + 32).toFixed(2);
                                console.log('temp: ', temp);
                                var tempEl = document.createElement("p");
                                tempEl.textContent = `Temp: ${temp} ℉`;
                                var wind = forecastData.current.wind_speed;
                                console.log('Wind: ', wind);
                                var windEl = document.createElement("p");
                                windEl.textContent = `Wind: ${wind} MPH`;
                                var humidity = forecastData.current.humidity;
                                console.log('humidity: ', humidity);
                                var humidityEl = document.createElement("p");
                                humidityEl.textContent = `Humidity: ${humidity} %`;
                                var UV = forecastData.current.uvi;
                                console.log('UV: ', UV);
                                var UVEl = document.createElement("p");
                                UVEl.textContent = `UV Index: ${UV}`;
                                currentWeatherContainer.append(tempEl, windEl, humidityEl, UVEl);

                                // Forecast Weather Data

                                var forecastDailyArray = forecastData.daily
                                forecastDailyArray.slice(0, 5).forEach(function (dailyData) {
                                    var date = new Date(dailyData.dt * 1000).toLocaleDateString();
                                    var forecastDateEl = document.createElement("p");
                                    forecastDateEl.textContent = date;
                                    var icon = dailyData.weather[0].icon;
                                    var iconUrl = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`;
                                    var forecastIconEl = document.createElement("a");
                                    forecastIconEl.innerHTML = iconUrl;
                                    var temp = ((dailyData.temp.max - 273.15) * 9 / 5 + 32).toFixed(2);
                                    var forecastTempEl = document.createElement("p");
                                    forecastTempEl.textContent = `Temp: ${temp} ℉;`;
                                    var wind = dailyData.wind_speed;
                                    var forecastWindEl = document.createElement("p");
                                    forecastWindEl.textContent = ` Wind: ${wind} MPH`
                                    var humidity = dailyData.humidity
                                    var forecastHumidityEl = document.createElement("p");
                                    forecastHumidityEl.textContent = humidity;

                                    forecastWeatherContainer.append(forecastDateEl, forecastIconEl, forecastTempEl, forecastWindEl, forecastHumidityEl);


                                    console.log(date, iconUrl, temp, wind, humidity);
                                })
                            })
                        })

                });

            } else {
                alert("Error: city not found");
            }
        })
}



userFormEl.addEventListener("submit", formSubmitHandler);
