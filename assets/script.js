const apiKey = "86d4850bf62b2bf805da324ab8d09a0b";
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    getWeatherData(city);
  }
});

document.getElementById("city-list").addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const city = event.target.textContent;
    getWeatherData(city);
  }
});

function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      saveToHistory(city);
      getForecast(city);
    });
}

function displayCurrentWeather(data) {
  const currentWeather = document.getElementById("current-weather");
  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentWeather.innerHTML = `
        <h2>${
          data.name
        } (${new Date().toLocaleDateString()}) <img src="${weatherIcon}" alt="${
    data.weather[0].description
  }"></h2>
        <p>Temp: ${data.main.temp} °F</p>
        <p>Wind: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity} %</p>
    `;
}

function saveToHistory(city) {
  const cityList = document.getElementById("city-list");
  const existingCities = Array.from(cityList.getElementsByTagName("li")).map(
    (li) => li.textContent
  );

  if (!existingCities.includes(city)) {
    const cityItem = document.createElement("li");
    cityItem.textContent = city;
    cityList.appendChild(cityItem);
  }
}

function getForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data);
    });
}

function displayForecast(data) {
  const forecast = document.getElementById("forecast");
  forecast.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const day = data.list[i * 8]; // Getting the forecast for the next 5 days
    const weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    const forecastDay = document.createElement("div");
    forecastDay.classList.add("day");
    forecastDay.innerHTML = `
            <h4>${new Date(
              day.dt_txt
            ).toLocaleDateString()} <img src="${weatherIcon}" alt="${
      day.weather[0].description
    }"></h4>
            <p>Temp: ${day.main.temp} °F</p>
            <p>Wind: ${day.wind.speed} MPH</p>
            <p>Humidity: ${day.main.humidity} %</p>
        `;
    forecast.appendChild(forecastDay);
  }
}
