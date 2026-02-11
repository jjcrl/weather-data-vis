import { useEffect, useState } from "react";
import Loader from "./Loader.jsx";
import "../App.css";
import { findMinMaxTemp ,findSunPhases} from "./helperFuncs.js";
import {
  VictoryArea,
  VictoryChart,
  VictoryPolarAxis,
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
      {/* {hourly && minMax ? 
        generateTemperatureGradient(hourly, minMax.min, minMax.max).map((stop, index) => (
          <stop key={index} offset={stop.offset} stopColor={stop.color} />
        ))
        : 
        <stop offset="0%" stopColor="#FFD700" />
      } */}

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
          domain={{
            x: [sunData[0].x, sunData[sunData.length - 1].x],
            y: [-20, 30],
          }}
          data={sunData}
          
          size={5}
          style={{
            data: {
               fill: (d) => {
               const intensity = d.datum._y / 10;
                if (intensity < 0.1) {
                return 'rgba(50, 50, 80, 0.2)'; // very faint dark dots for night
                                     }
                 return `rgba(245, 185, 0, ${intensity})`;
    },
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
              opacity: "10%",
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
