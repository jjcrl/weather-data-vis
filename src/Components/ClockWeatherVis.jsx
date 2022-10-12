import React from "react";
import { useEffect, useState } from "react";
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

import { fecth24HForecast } from "../api";

const ClockWeatherVis = () => {
  const [hourly, setHourly] = useState();
  const [curr, setCurr] = useState();
  const [sunData, setSunData] = useState();
  // const [description, setDescrption] = useState();
  // const [light, setlight] = useState(["#5e4d5d", "#cfcbd9"]);
  const [minMax, setMinMax] = useState();
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().getTime() / 1000);

  useEffect(() => {
    fecth24HForecast().then((data) => {
      setHourly(data.hourlyForecast);
      setMinMax(findMinMaxTemp(data.hourlyForecast));
      // setDescrption(data.description);
      setCurr(data.currWeather);
      setSunData(findSunPhases(data.sunrise, data.sunset));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setTime(new Date().getTime() / 1000);
  }

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
    const diff = b - a;
    const hours = Math.floor(diff / 3600);
    const step = Math.floor(diff / hours);
    const data = [{ x: a, y: 1 }];
    for (let i = 0; i < hours - 2; i++) {
      data.push({
        x: Math.floor(data[i].x + step),
        y: i <= 7 ? data[i].y + 1 : data[i].y - 1,
      });
    }
    data.push({ x: b, y: data[data.length - 1].y - 1 });
    return data;
  };

  if (loading) return <Loader />;

  return (
    <>
      <svg style={{ height: 0, width: 0 }}>
        <defs>
          <linearGradient id="myGradient">
            <stop offset="0%" stopColor="#fcbf56" />
            <stop offset="5%" stopColor="#fcbf56" />
            <stop offset="50%" stopColor="#e95b37" />
            <stop offset="90%" stopColor="#ab4358" />
            <stop offset="100%" stopColor="#91345b" />
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
        startAngle={450}
        endAngle={90}
        height={740}
        width={800}
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
              stroke: "url(#myGradient)",
              strokeWidth: "7",
            },
          }}
        />

        <circle
          cx="400"
          cy="370"
          r="105"
          fill="black"
          stroke="#c67477"
          strokeWidth={0}
        />
        <circle
          cx="400"
          cy="370"
          r="105"
          fill="url(#pattern2)"
          stroke="#c67477"
          strokeWidth={0.3}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={400}
          y={371}
          style={{
            fontSize: 50,
            fill: "whitesmoke",
            fontFamily: "GT Maru Trial",
            opacity: "75%",
            fontWeight: 600,
          }}
          text={[
            `${new Date(time * 1000).toLocaleTimeString(undefined, {
              hour12: false,
              hour: "numeric",
              minute: "numeric",
            })} `,
          ]}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={400}
          y={415}
          style={{
            opacity: "50%",
            fontSize: 15,
            fill: "#cfcbd9",
            fontFamily: "GT Maru Trial",
          }}
          text={[
            `${new Date(time * 1000).toLocaleDateString(undefined, {
              weekday: "long",
            })}`,
          ]}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={402}
          y={438}
          style={{
            opacity: "30%",
            fontSize: 14,
            fill: "#cfcbd9",
            fontFamily: "GT Maru Trial",
          }}
          text={[
            `${new Date(time * 1000).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
            })}`,
          ]}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={455}
          y={330}
          style={{
            fontSize: 16,
            fill: "#cfcbd9",
            opacity: "50%",
            fontFamily: "GT Maru Trial",
          }}
          text={curr.conditions}
          transform="skewX(-10)"
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={403}
          y={300}
          style={{
            fontSize: 15,
            fill: "#cfcbd9",
            opacity: "30%",
            fontFamily: "GT Maru Trial",
          }}
          text={`H:${minMax.max}° L:${minMax.min}°`}
        />
      </VictoryChart>
    </>
  );
};

export default ClockWeatherVis;
