const fetch = require("node-fetch");
const { appendFile } = require("fs").promises;
const { normalize, resolve } = require("path");

const cityName = process.argv[2];

function safeJoin(base, target) {
  const targetPath = "." + normalize("/" + target);
  return resolve(base, targetPath);
}

const getDataFileName = (city) => safeJoin('./data/', `${city}.txt`);

const processWeatherData = async (data) => {
  const foundData = data.find((stationData) => stationData.stacja === cityName);
  if (!foundData) {
    console.log("Brak takiego miasta w rejestrze");
    return;
  }
  const {
    cisnienie: pressure,
    wilgotnosc_wzgledna: humidity,
    temperatura: temperature,
  } = foundData;

  const weatherInfo = `In ${cityName} there is ${temperature}°C, ${humidity}% of humidity and pressure of ${pressure} hPa.`;
  console.log(weatherInfo);

  const dateString = new Date().toLocaleDateString();

  await appendFile(getDataFileName(cityName), `${dateString}\n${weatherInfo}\n`)
};

fetch("https://danepubliczne.imgw.pl/api/data/synop/")
  .then((r) => r.json())
  .then(processWeatherData);
