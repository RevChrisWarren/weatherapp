var userFormEl = document.querySelector("#user-form");
var cityEl = document.querySelector("#city");
var forecastContainerEl = document.querySelector("#weatherdata");
var currentWeatherContainer = document.getElementById("current");
var forecastWeatherContainer = document.getElementById("forecast");
var fiveDayTitle = document.getElementById("five-day");
var btn2El = document.querySelector("#button2");



var formSubmitHandler = function (event) {
    //prevent page from refreshing
    event.preventDefault();

    //get value from input element
    var cityArray = JSON.parse(localStorage.getItem("searchHistory")) || [];
    var cityName = cityEl.value.trim();
    console.log('cityArray: ', cityArray);
    console.log('cityName: ', cityName);
    
    console.log(cityArray);
    if (cityName) {
        if (!cityArray.includes(cityName)) {
            // first zero means put new item in 0 place, second zero means do not delete other items
            cityArray.splice(0, 0, cityName);
        }
        localStorage.setItem("searchHistory", JSON.stringify(cityArray))
        getCityGeo(cityName)
            .then(function (latLon) {
                //console.log('latLon: ', latLon);
                return getWeatherData(latLon)
            })

        //clear old content
        forecastContainerEl = "";
        cityEl.value = "";
    } else {
        alert("Please enter a city name")
    }
};

// take city name and translate it into longitude and latitude
function getCityGeo(city) {
    //find the latitude and longitude for the city
    var apiUrlGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=8d03dfd7dbf3df23ffe6a5d84a5e5242";
    return fetch(apiUrlGeo)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                alert("Error: city not found");
            }
        })
        .then(function (data) {
            //console.log('data: ', data);
            var currentCity = data[0].name;
            var todayDate = moment().format("MM/DD/YYYY");
            var currentCityDateEl = document.createElement("h2")
            currentCityDateEl.textContent = currentCity + " " + "(" + todayDate + ")";
            currentWeatherContainer.textContent = "";
            currentCityDateEl.classList.add("inline");
            currentWeatherContainer.append(currentCityDateEl);

            return {
                lat: data[0].lat,
                lon: data[0].lon
            }

        })
}
// create function to get the weather data
function getWeatherData(latLon) {
    var lat = latLon.lat;
    var lon = latLon.lon;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=8d03dfd7dbf3df23ffe6a5d84a5e5242`
    //console.log('forecastUrl: ', forecastUrl);
    fetch(forecastUrl)
        .then(function (res) {
            return res.json()
        })
        .then(function (forecastData) {
            // Current Weather Data
            // console.log(forecastData);
            var currentIcon = forecastData.current.weather[0].icon;
            //console.log(currentIcon);
            var currentIconUrl = `<img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png">`;
            var currentIconEl = document.createElement("p");
            currentIconEl.innerHTML = currentIconUrl;
            currentIconEl.classList.add("inline");
            currentWeatherContainer.append(currentIconEl);
            //calculate kelvin temperature into fahrenheit (0K − 273.15) × 9/5 + 32 = -459.7°F
            var temp = ((forecastData.current.temp - 273.15) * 9 / 5 + 32).toFixed(2);
            //console.log('temp: ', temp);
            var tempEl = document.createElement("p");
            tempEl.textContent = `Temp: ${temp} ℉`;
            var wind = forecastData.current.wind_speed;
            // console.log('wind: ', wind);
            var windEl = document.createElement("p");
            windEl.textContent = `Wind: ${wind} MPH`;
            var humidity = forecastData.current.humidity;
            //console.log('humidity: ', humidity);
            var humidityEl = document.createElement("p");
            humidityEl.textContent = `Humidity: ${humidity} %`;
            var UV = forecastData.current.uvi;
            // console.log('UV: ', UV);
            var UVIntroEl = document.createElement("p");
            UVIntroEl.classList.add("inline");
            UVIntroEl.textContent = "UV Index: ";
            var UVEl = document.createElement("p");
            UVEl.classList.add("inline");
            UVEl.textContent = " " + UV + " ";
            if (UV <= 2) {
                UVEl.setAttribute("style", "background-color: rgb(139, 230, 124); width: 35px");
            } else if (UV > 2) {
                UVEl.setAttribute("style", "background-color: rgb(240, 161, 150); width: 35px");
            }
            currentWeatherContainer.setAttribute("style", "border: 2px solid black");
            currentWeatherContainer.append(tempEl, windEl, humidityEl, UVIntroEl, UVEl);


            // Forecast Weather Data

            var forecastDailyArray = forecastData.daily
            var title = document.createElement("h2");
            title.innerHTML = "5-Day Forecast:" + "</br>";
            title.style.width = "100%";
            forecastWeatherContainer.append(title);
            forecastDailyArray.slice(0, 5).forEach(function (dailyData) {

                var container = document.createElement("div");

                var date = new Date(dailyData.dt * 1000).toLocaleDateString();
                var forecastDateEl = document.createElement("p");
                forecastDateEl.textContent = date;
                var icon = dailyData.weather[0].icon;
                var iconUrl = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`;
                var forecastIconEl = document.createElement("p");
                forecastIconEl.innerHTML = iconUrl;
                var temp = ((dailyData.temp.max - 273.15) * 9 / 5 + 32).toFixed(2);
                var forecastTempEl = document.createElement("p");
                forecastTempEl.textContent = `Temp: ${temp} ℉;`;
                var wind = dailyData.wind_speed;
                var forecastWindEl = document.createElement("p");
                forecastWindEl.textContent = `Wind: ${wind} MPH`
                var humidity = dailyData.humidity
                var forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.textContent = "Humidity: " + humidity + " %";


                container.append(forecastDateEl, forecastIconEl, forecastTempEl, forecastWindEl, forecastHumidityEl);
                container.setAttribute("style", "background-color: gray; margin: 5px");
                container.classList.add("weather-text");
                forecastWeatherContainer.classList.add("row");
                forecastWeatherContainer.append(container);
            })
            btnCreator();
        })
}
// create new buttons for search from array in locaStorage
function btnCreator() {
    btn2El.innerHTML = "";
    var cityArray = JSON.parse(localStorage.getItem("searchHistory")) || [];
    for (let i = 0; i < cityArray.length; i++) {
        var cityButton = document.createElement("button");
        cityButton.type = "button";
        cityButton.innerHTML = cityArray[i];
        cityButton.className = "btn btn-secondary"
        cityButton.addEventListener("click", function cityButtonPress() {
            getCityGeo(cityArray[i])
            .then(function (latLon) {
                //console.log('latLon: ', latLon);
                return getWeatherData(latLon)
            })

        //clear old content
    
        forecastContainerEl = "";
        cityEl.value = "";
        
        })
        btn2El.append(cityButton);
    }
}



btnCreator();
userFormEl.addEventListener("submit", formSubmitHandler);



