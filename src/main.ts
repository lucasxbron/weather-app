import "./style.css";

const formEl = document.querySelector("form");

function getCity(event: Event) {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const formInputs = Object.fromEntries(formData.entries());
  const cityValue = (formInputs.city as string).trim().toLowerCase();
  const isCityValid =
    cityValue.length >= 2 && cityValue.length <= 100 ? "valid" : "invalid";
  console.log("🚀 ~ getCity ~ cityValue:", cityValue)
  console.log("🚀 ~ getCity ~ isCityValid:", isCityValid);
}

formEl?.addEventListener("submit", getCity);
