export const fecth24HForecast = async () => {
  const query =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/manchester/today?unitGroup=metric&include=hours%2Ccurrent&key=EST45QEHPPZ7PDCXEKLA642C4&contentType=json";

  const response = await fetch(query);

  const data = await response.json();

  const hourlyForecast = data.days[0].hours;

  const description = data.days[0].description;

  const sunrise = data.days[0].sunriseEpoch;

  const sunset = data.days[0].sunsetEpoch;

  const currWeather = data.currentConditions;

  return { hourlyForecast, description, sunrise, sunset, currWeather };
};
