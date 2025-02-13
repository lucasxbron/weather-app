import "./style.css";

const formEl = document.querySelector("form");
const weatherEl = document.getElementById("weather");

async function searchCityWeather(event: Event) {
  event.preventDefault();
  const city = getCity(event);
  const sanititedCity = sanitizeCity(city);
  const isValidCity = isCityValid(sanititedCity);
  //   displayCityValidationStatus(isValidCity);

  if (isValidCity) {
    const coordinates = await getLatLonByCity(sanititedCity);
    if (coordinates) {
      const { lat, lon } = coordinates;
      await getWeatherData(lat, lon);
    }
  }
}

formEl?.addEventListener("submit", searchCityWeather);

/**
 * Updates the text content and styling of a span element to indicate the validation status of a city.
 *
 * @param isValidCity - A boolean indicating whether the city is valid (true) or invalid (false).
 */
// function displayCityValidationStatus(isValidCity: boolean) {
//   const spanEl = document.querySelector("span");
//   if (!isValidCity) {
//     spanEl!.textContent = "Invalid";
//     spanEl!.classList.add("text-red-500");
//   } else {
//     spanEl!.textContent = "Valid";
//     spanEl!.classList.add("text-green-500");
//   }

//   spanEl!.classList.remove("hidden");
// }

/**
 * Extracts the city value from a form submission event.
 *
 * @param {Event} event - The form submission event.
 * @returns {string} - The value of the city input field.
 */
function getCity(event: Event): string {
  const formData = new FormData(event.target as HTMLFormElement);
  const formInputs = Object.fromEntries(formData.entries());
  const cityValue = formInputs.city as string;
  return cityValue;
}

/**
 * Sanitizes the input city name by trimming whitespace and converting it to lowercase.
 *
 * @param cityValue - The name of the city to sanitize.
 * @returns The sanitized city name.
 */
function sanitizeCity(cityValue: string): string {
  const cityValueSanitized = cityValue.trim().toLowerCase();
  return cityValueSanitized;
}

/**
 * Checks if the given city name is valid based on its length.
 *
 * @param cityValueSanitized - The sanitized city name to validate.
 * @returns `true` if the city name length is between 2 and 100 characters, inclusive; otherwise, `false`.
 */
function isCityValid(cityValueSanitized: string): boolean {
  const isCityValid =
    cityValueSanitized.length >= 2 && cityValueSanitized.length <= 100
      ? true
      : false;
  return isCityValid;
}

async function getLatLonByCity(city: string) {
  const apiKey = "71ef9b2bf0064a20c46c5ee2f838b154";
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error("City not found. Please try again later.");
    const data = await response.json();
    if (data.length === 0)
      throw new Error("City not found. Please try again later.");
    const { lat, lon } = data[0];
    return { lat, lon };
  } catch (error: any) {
    console.error(error.message);
    displayError(error.message);
    return null;
  }
}


async function getWeatherData(lat: string, lon: string) {
  const apiKey = "71ef9b2bf0064a20c46c5ee2f838b154";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error("Weather data not found. Please try again later.");
    const data = await response.json();
    console.log(data);
    displayWeatherData(data);
    return data;
  } catch (error: any) {
    console.error(error.message);
    displayError(error.message);
    return null;
  }
}

function displayError(message: string) {
  if (!weatherEl) return;
  weatherEl.innerHTML = `
        <div class="mt-6 rounded-lg p-6 text-black">
                <p class="text-lg">${message}</p>
        </div>
    `;
}

function displayWeatherData(weatherData: any) {
  if (!weatherEl) return;

  const cityName = weatherData.city.name;
  const todayWeather = weatherData.list[0];

  const tempCelsius = todayWeather.main.temp - 273.15;
  weatherEl.innerHTML = `
    <div class="mt-6 shadow-md rounded-lg p-6 text-white bg-blue-500">
        <h2 class="text-2xl font-bold mb-2">${cityName}</h2>
        <p class="text-lg"><span class="inline-block w-8 text-center"><i class="fas fa-thermometer-half"></i></span> Temperature: ${tempCelsius.toFixed(
          1
        )}°C</p>
        <p class="text-lg"><span class="inline-block w-8 text-center"><i class="fas fa-cloud"></i></span> Weather: ${
          todayWeather.weather[0].description
        }</p>
        <p class="text-lg"><span class="inline-block w-8 text-center"><i class="fas fa-tint"></i></span> Humidity: ${
          todayWeather.main.humidity
        }%</p>
        <p class="text-lg"><span class="inline-block w-8 text-center"><i class="fas fa-wind"></i></span> Wind Speed: ${
          todayWeather.wind.speed
        } m/s</p>
    </div>
`;
}
