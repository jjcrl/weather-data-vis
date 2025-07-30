import React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import Loader from "./Loader.jsx";
import "../App.css";

import {
  VictoryArea,
  VictoryChart,
  VictoryPolarAxis,
  VictoryLabel,
  VictoryContainer,
  VictoryScatter,
} from "victory";

import { fetch24HForecast } from "../api";
import ClockDisplay from './ClockDisplay.jsx'


const CHART_CONFIG = {
  CENTER_X: 400,
  CENTER_Y: 370,
  RADIUS: 105,
  WIDTH: 800,
  HEIGHT: 740,
  START_ANGLE: 450,
  END_ANGLE: 90,
  STROKE_WIDTH: 7,
  AXIS_STROKE_WIDTH: 4,
  AXIS_DASH_ARRAY: 270,
};

const STYLES = {
  FONT_FAMILY: "GT Maru Trial",
  GRADIENT_ID: "myGradient",
  PATTERN1_ID: "pattern1",
  PATTERN2_ID: "pattern2",
};

const ClockWeatherVis = () => {
  const [hourly, setHourly] = useState();
  const [curr, setCurr] = useState();
  const [sunData, setSunData] = useState();
  const [minMax, setMinMax] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date().getTime() / 1000);  

  useEffect(() => {
    fetch24HForecast()
      .then((data) => {
        if (!data || !data.hourlyForecast) {
          throw new Error('Invalid weather data received');
        }
        
        setHourly(data.hourlyForecast);
        setCurr(data.currWeather);
        setMinMax(findMinMaxTemp(data.hourlyForecast));
        setSunData(findSunPhases(data.sunrise, data.sunset));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Weather data fetch failed:', err);
        setError('Failed to load weather data. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  },[]);

  function tick() {
    setTime(new Date().getTime() / 1000);
  }
  
  const generateTemperatureGradient = (hourlyData, minTemp, maxTemp) => {
  const coldColor = { h: 254, s: 48, l: 52 }; // Blue for cold
  const hotColor = { h: 11, s: 89, l: 52 };   // Orange-red for hot
  
  return hourlyData.map((hour, index) => {
    // Normalize temperature to 0-1 range
    const normalized = (hour.temp - minTemp) / (maxTemp - minTemp);
    
    // Interpolate between cold and hot colors
    const h = Math.round(coldColor.h + (hotColor.h - coldColor.h) * normalized);
    const s = Math.round(coldColor.s + (hotColor.s - coldColor.s) * normalized);
    const l = Math.round(coldColor.l + (hotColor.l - coldColor.l) * normalized);
    
    // Calculate position around the circle
    const position = (index / (hourlyData.length - 1)) * 100;
    
    return {
      offset: `${Math.round(position)}%`,
      color: `hsl(${h}, ${s}%, ${l}%)`
    };
  });
};

  const findMinMaxTemp = (arrOfObjs) => {
    const temps = arrOfObjs.map((d) => {
      return d.temp;
    });
    const sorted = temps.sort((a, b) => a - b);
    let [min] = sorted;
    min = Math.floor(min);
    const max = Math.ceil(sorted[sorted.length - 1]);
    return { min, max };
  };

const findSunPhases = (a, b) => {
  const data = [];
  const baselineValue = 0;
  const maxSunValue = 10;
  
  // Convert timestamps to Date objects
  const sunriseDate = new Date(a * 1000);
  const sunsetDate = new Date(b * 1000);
  
  // Get the base date (midnight of the same day)
  const baseDate = new Date(sunriseDate);
  baseDate.setHours(0, 0, 0, 0);
  
  // Calculate sunrise and sunset hours as decimal values
  const sunriseHour = sunriseDate.getHours() + (sunriseDate.getMinutes() / 60);
  const sunsetHour = sunsetDate.getHours() + (sunsetDate.getMinutes() / 60);
  
  // Calculate peak hour (solar noon)
  const daylightDuration = sunsetHour - sunriseHour;
  const peakHour = sunriseHour + (daylightDuration / 2);
  
  // Generate data for all 24 hours
  for (let hour = 0; hour < 24; hour++) {
    // Create timestamp for this hour
    const hourTimestamp = Math.floor(baseDate.getTime() / 1000) + (hour * 3600);
    
    let sunIntensity;
    
    if (hour < sunriseHour || hour > sunsetHour) {
      // Nighttime: use baseline value
      sunIntensity = baselineValue;
    } else {
      // Daytime: calculate sun intensity using a bell curve
      const distanceFromPeak = Math.abs(hour - peakHour);
      const maxDistance = daylightDuration / 2;
      
      // Use cosine function for smooth curve from sunrise to sunset
      const normalizedDistance = distanceFromPeak / maxDistance;
      const cosineValue = Math.cos(normalizedDistance * Math.PI / 2);
      
      // Scale to our desired range
      sunIntensity = Math.round(cosineValue * maxSunValue * 100) / 100;
    }
    
    data.push({
      x: hourTimestamp,
      y: sunIntensity
    });
  }
  
  return data;
};






  if (loading) return <Loader />;
  if (error) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#ef4444',
      fontSize: '18px',
      fontFamily: 'GT Maru Trial'
    }}>
      ⚠️ {error}
    </div>
  );
  return (
    <>
      <svg style={{ height: 0, width: 0 }}>
        <defs>
        <linearGradient id="temperatureGradient">
  {hourly && minMax ? 
    generateTemperatureGradient(hourly, minMax.min, minMax.max).map((stop, index) => (
      <stop key={index} offset={stop.offset} stopColor={stop.color} />
    ))
    : 
    <stop offset="0%" stopColor="#FFD700" />
  }
</linearGradient>
          <pattern
            id="pattern1"
            x="10"
            y="10"
            width="1"
            height="1"
            patternUnits="userSpaceOnUse"
          >
            <circle
              r={0.45}
              cx={0.5}
              cy={0.5}
              style={{ fill: "peachpuff", opacity: "100%" }}
            />
          </pattern>
          <pattern
            id="pattern2"
            x="10"
            y="10"
            width="1"
            height="1"
            patternUnits="userSpaceOnUse"
          >
            <circle
              r={0.3}
              cx={0.5}
              cy={0.5}
              style={{ fill: "#5e4d5d", opacity: "25%" }}
            />
          </pattern>
        </defs>
      </svg>

      <VictoryChart
  polar
  scale={{ x: "time" }}
  startAngle={CHART_CONFIG.START_ANGLE}
  endAngle={CHART_CONFIG.END_ANGLE}
  height={CHART_CONFIG.HEIGHT}
  width={CHART_CONFIG.WIDTH}
  containerComponent={<VictoryContainer responsive={false} />}
>
        <VictoryPolarAxis
          style={{
            axis: { stroke: "whitesmoke", strokeWidth: 0, opacity: "20%" },
            tickLabels: {
              fontSize: 25,
              opacity: "50%",
              padding: -25,
              fill: "#5e4d5d",
              fontFamily: "GT Maru Trial",
            },
          }}
          labelPlacement="perpendicular"
          tickValues={hourly.map((h) => h.datetimeEpoch)}
          tickFormat={(t) => {
            let time = new Date(t * 1000).toLocaleTimeString().slice(0, 2);
            if (time === "00") {
              time = "24";
            }
            return time[0] === "0" ? time.slice(-1) : time;
          }}
        />

        <VictoryScatter
          interpolation="basis"
          domain={{
            x: [sunData[0].x, sunData[sunData.length - 1].x],
            y: [-20, 30],
          }}
          data={sunData}
          style={{
            data: {
              stroke: "peachpuff",
              opacity: "100%",
              strokeWidth: 0.23,
            },
          }}
        />

        <VictoryPolarAxis
          dependentAxis
          axisValue={time}
          style={{
            axisLabel: {
              fontSize: 40,
              padding: 20,
              fill: "#cfcbd9",
              fontFamily: "GT Maru Trial",
              fontWeight: 600,
            },
            axis: {
              stroke: "whitesmoke",
              strokeWidth: 4,
              strokeDasharray: 270,
              opacity: "65%",
            },
            tickLabels: { display: "none" },
          }}
          label={`${Math.ceil(curr.temp).toString()}°`}
          labelPlacement="vertical"
        />

        <VictoryArea
          domain={{
            y: [minMax.min, minMax.max + 5],
            x: [
              hourly[0].datetimeEpoch,
              hourly[hourly.length - 1].datetimeEpoch,
            ],
          }}
          data={hourly}
          x={"datetimeEpoch"}
          y={"temp"}
          interpolation="basis"
          labelPlacement="horizontal"
          style={{
            data: {
              fill: "none",
              stroke: "url(#temperatureGradient)",
                            strokeWidth: "10",
            },
          }}
        />
<ClockDisplay time={time} curr={curr} minMax={minMax} />
      </VictoryChart>
    </>
  );
};

export default ClockWeatherVis;
