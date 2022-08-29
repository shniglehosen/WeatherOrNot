let dayTimeWeatherEL = document.getElementById('dayTimeWeather');
var repoList = document.querySelector('ul');
var fetchButton = document.getElementById('fetch-button');
var apiKey = "0a96368df2380f055e6d2a56b8e2a8a7";
var inputboxEl = document.getElementById("inputInput");
var apieKeyMap = "JQBwiKz7mElblzM0fnId15X3ngEynG51";
var fiveDay = document.getElementById('5-day');


const history = JSON.parse(localStorage.getItem("history")) || [];
renderSearchHistory();

function getApi(lng, lat){
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=imperial&exclude={part}&appid=${apiKey}`)
  .then(response => response.json())
  .then(response => {
    console.log(response);

    for (let index = 1; index <= 5; index++) {
      const dailyBreak = response.daily[index];

      let card = document.createElement("div");
      card.classList.add("card", "col", "m-1");
      card.innerHTML = `
        <div class="card-body">
        <p class="card-title">${new Date(dailyBreak.dt * 1000).toLocaleString(
          "en-US",
          { weekday: "long" }
        )}</p>
        <p class="card-text">Temp ${dailyBreak.temp.day}</p>
        <p class="card-text">Wind ${dailyBreak.wind_speed}</p>
        <p class="card-text">Humidity ${dailyBreak.humidity}</p>
        </div
      `;
      fiveDay.append(card);
    }
    renderSearchHistory();
  });
}

  
function pullResults(boxInput) {
  console.log(inputboxEl.value);
  fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${apieKeyMap}&location=${boxInput}`)
      .then(response => response.json())
      .then(response => {
          let lat = response.results[0].locations[0].displayLatLng.lat;
          let lng = response.results[0].locations[0].displayLatLng.lng;
          fiveDay.innerHTML = "";
          getApi(lng, lat);
      })
      .catch(err => console.log(err));
}

fetchButton.addEventListener('click', pullResults);

function renderSearchHistory() {
  document.querySelector(".previousSearch").innerHTML = "";
  for (let index = 0; index < history.length; index++) {
    var button = document.createElement("button");
    button.classList.add("btn-block", "btn-secondary", "btn");
    button.addEventListener("click", function () {
      getApi(history[index]);
    });
    button.textContent = history[index];
    document.querySelector(".previousSearch").append(button);
  }
}

function hamdler (event) {
  event.preventDefault();
  var boxInput = inputboxEl.value;
  pullResults(boxInput);
}