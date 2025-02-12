import "./style.css";

const formEl = document.querySelector("form");

function getCity(event: Event) {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const formInputs = Object.fromEntries(formData.entries());
  const cityValue = formInputs.city;
}

formEl?.addEventListener("submit", getCity);
