var apiKey = "0a96368df2380f055e6d2a56b8e2a8a7";
var apieKeyMap = "JQBwiKz7mElblzM0fnId15X3ngEynG51";
var cityInput = $('input[name="city"]');
var formEl = $(`#city-form`);
var clearEl = document.getElementsByClassName("btn btn-block red");
console.log(clearEl);

const history = JSON.parse(localStorage.getItem("history")) || [];
renderSearchHistory();

// fetch for current weather
function apiCall(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // check if data.name is in the history array already. If not, add it
      if (data.name && !history.includes(data.name)) {
        history.push(data.name);
        localStorage.setItem("history", JSON.stringify(history));
      }

      renderSearchHistory();

      $("#date").text(
        new Date(data.dt * 1000).toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
      $("#displayboxtitle").text(data.name);
      $("#temp").text(`Temp: ${data.main.temp}`);
      $("#wind").text(`Wind: ${data.wind.speed} 🌬️`);
      $("#humidity").text(`Humidity: ${data.main.humidity}`);
      // if we need data from a previous API call we have to WAIT for that data to be returned to
      oneCall(data.coord.lat, data.coord.lon);
    });
}

function oneCall(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var className;
    //  1-2 Low         (1 - 2.99999)   Green
    //  3-5 Moderate    (3 - 5.99999)   Yellow 
    //  6-7 High        (6 - 7.99999)   Orange
    //  8-10 Very High  (8 - 10.9999)   Red
    //  11+ Extreme     (11+ )          Purple
      if (data.current.uvi < 3) { 
        className = "green";
      } else if (data.current.uvi < 6) {
        className = "yellow";
      } else if (data.current.uvi < 8) {
        className = "orange";
      } else if (data.current.uvi < 11) {
        className = "red";
      } else {
        className = "purple";
      }
      $("#uvi").addClass(className);
      $("#uvi").text(`UV Index: ${data.current.uvi}`);

// 5 day forecast for loop, and add to cards
      for (let index = 1; index <= 5; index++) {
        element = data.daily[index];
        console.log(element);

        let card = document.createElement("div");
        card.classList.add("card", "col", "m-1");
        card.innerHTML = `
          <div class="card-body">
          <p class="card-title">${new Date(element.dt * 1000).toLocaleString(
            "en-US",
            { weekday: "long" }
          )}</p>
          <p class="card-text">Temp ${element.temp.day}</p>
          <p class="card-text">Wind ${element.wind_speed}</p>
          <p class="card-text">Humidity ${element.humidity}</p>
          </div
        `;
        document.getElementById("5-day").append(card);
      }
    });
}

function handleFormSubmit(event) {
  event.preventDefault();
  var cityName = cityInput.val();
  var Forecast5Day = document.getElementById("5-day");
  Forecast5Day.innerHTML = ""; 
  apiCall(cityName);
}

formEl.on("submit", handleFormSubmit);

// create search history and add to functional buttons
function renderSearchHistory() {
  document.querySelector(".history-container").innerHTML = "";
  for (let index = 0; index < history.length; index++) {
    var button = document.createElement("button");
    button.classList.add("btn-block", "btn-secondary", "btn");
    button.addEventListener("click", function () {
      var Forecast5Day = document.getElementById("5-day");
      Forecast5Day.innerHTML = ""; 
      apiCall(history[index]);
    });
    button.textContent = history[index];
    document.querySelector(".history-container").append(button);
  }
}

clearEl.on("reset", handleClear);

function handleClear () {
  document.querySelector(".history-container") = "";

}