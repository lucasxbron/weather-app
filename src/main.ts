import "./style.css";

const formEl = document.querySelector("form");

function searchCityWeather(event: Event) {
  event.preventDefault();
  const city = getCity(event);
  const sanititedCity = sanitizeCity(city);
  const isValidCity = isCityValid(sanititedCity);

  function getCity(event: Event): string {
    const formData = new FormData(event.target as HTMLFormElement);
    const formInputs = Object.fromEntries(formData.entries());
    const cityValue = formInputs.city as string;
    return cityValue;
  }

  function sanitizeCity(cityValue: string): string {
    const cityValueSanitized = cityValue.trim().toLowerCase();
    return cityValueSanitized;
  }

  function isCityValid(cityValueSanitized: string): boolean {
    const isCityValid =
      cityValueSanitized.length >= 2 && cityValueSanitized.length <= 100
        ? true
        : false;
    return isCityValid;
  }
}

formEl?.addEventListener("submit", searchCityWeather);
