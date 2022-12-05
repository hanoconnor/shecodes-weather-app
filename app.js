// Define Variables
const apiKey = "f09d3949047ab6c9e3bcaf79cf61f619";

let dayTimeField = document.querySelector("#day-time");
let locationHeader = document.querySelector("#location-header");
let weatherDescription = document.querySelector("#weather-description");
let dailyTemp = document.querySelector("#daily-temp");
let humidityPercent = document.querySelector("#humidity");
let windMph = document.querySelector("#wind-speed");
let weatherIconMain = document.querySelector("#weather-icon-main");

// City Search function
let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("submit", searchCity);
function searchCity(e) {
  e.preventDefault();
  let cityInput = document.querySelector("#city-input");
  if (cityInput.value) {
    let searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;
    axios.get(searchUrl).then(updateTemp);
  } else {
    locationHeader.innerHTML = "Please type a city";
  }
}

// Current Location

let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", getPosition);

function getPosition(e) {
  navigator.geolocation.getCurrentPosition(function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(locationUrl).then(updateTemp);
  });
}

function getForecast(coordinates) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(forecastApiUrl).then(displayForecast);
}

function updateTemp(response) {
  let temp = Math.round(response.data.main.temp);
  let location = response.data.name;
  let windSpeed = Math.round(response.data.wind.speed);
  let descriptionMain = response.data.weather[0].main;
  let humidity = response.data.main.humidity;
  locationHeader.innerHTML = location;
  weatherDescription.innerHTML = descriptionMain;
  dailyTemp.innerHTML = temp;
  windMph.innerHTML = `Wind Speed: ${windSpeed} km/h`;
  humidityPercent.innerHTML = `Humidity: ${humidity}%`;
  weatherIconMain.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIconMain.setAttribute("alt", descriptionMain);

  getForecast(response.data.coord);

  // Temperature Conversion functions

  function displayCelsius(e) {
    e.preventDefault();
    dailyTemp.innerHTML = temp;
    fahrenheit.classList.remove("active");
    celsius.classList.add("active");
  }

  function displayFahrenheit(e) {
    e.preventDefault();
    let fahrenheitTemp = Math.round(temp * 1.8 + 32);
    dailyTemp.innerHTML = fahrenheitTemp;
    celsius.classList.remove("active");
    fahrenheit.classList.add("active");
  }

  let celsius = document.querySelector("#celsius-link");
  celsius.addEventListener("click", displayCelsius);
  let fahrenheit = document.querySelector("#fahrenheit-link");
  fahrenheit.addEventListener("click", displayFahrenheit);
}

// Format Current Date & Time

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let mins = date.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[dayIndex];
  let time = `${hours}:${mins}`;

  return `${day} ${time}`;
}

let currentTime = new Date();
dayTimeField.innerHTML = formatDate(currentTime);

// Display Forecast function

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
   <div class="col-2">
          <div class="card">
            <span class="forecast-day-title">${day}</span>
            <img src="https://openweathermap.org/img/wn/02d@2x.png" alt="forecast-icon" class="card-icon" id="card-icon-1">
            <div class="forecast-temps">
              <span class="forecast-max-temp">18°</span> | <span class="forecast-min-temp">10°</span>
            </div>
          </div>
        </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
