import React from "react";
import { useEffect, useState } from "react";
import Loader from "./Loader.jsx";
import "../../public/index.css";

import {
  VictoryArea,
  VictoryChart,
  VictoryPolarAxis,
  VictoryLine,
  VictoryLabel,
  VictoryContainer,
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
              padding: -20,
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

        <VictoryLine
          interpolation="basis"
          domain={{
            y: [-10, 30],
            x: [sunData[0].x, sunData[sunData.length - 1].x],
          }}
          data={sunData}
          style={{
            data: {
              stroke: "none",
              fill: "peachpuff",
              opacity: "10%",
            },
          }}
        />

        <VictoryPolarAxis
          dependentAxis
          axisValue={time}
          style={{
            axisLabel: {
              fontSize: 45,
              padding: 45,
              fill: "#cfcbd9",
              fontFamily: "GT Maru Trial",
            },
            axis: {
              stroke: "whitesmoke",
              strokeWidth: 2.5,
              strokeDasharray: 270,
              opacity: "30%",
            },
            tickLabels: { display: "none" },
          }}
          label={`${Math.ceil(curr.temp).toString()}°`}
          labelPlacement="vertical"
        />

        <VictoryArea
          animate={{
            animationWhitelist: ["data"],
            onLoad: {
              duration: 30000,
              before: (datum) => ({ _y: datum._y }),
              after: (datum) => ({
                _y: datum._y + 0.1,
              }),
            },
          }}
          domain={{
            y: [minMax.min, minMax.max + 10],
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
              strokeWidth: "12",
            },
          }}
        />

        <circle
          cx="400"
          cy="370"
          r="105"
          fill="#090909"
          stroke="#c67477"
          strokeWidth={0.2}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={403}
          y={371}
          style={{
            fontSize: 36,
            fill: "whitesmoke",
            fontFamily: "GT Maru Trial",
          }}
          text={[
            `${new Date(time * 1000).toLocaleTimeString(undefined, {
              hour12: true,
              hour: "numeric",
              minute: "numeric",
            })} `,
          ]}
        />

        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={401}
          y={405}
          style={{
            opacity: "70%",
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
          x={401}
          y={430}
          style={{
            opacity: "50%",
            fontSize: 17,
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
          x={460}
          y={335}
          style={{
            fontSize: 15,
            fill: "#cfcbd9",
            opacity: "70%",
            fontFamily: "GT Maru Trial",
          }}
          text={curr.conditions}
          transform="skewX(-10)"
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={401}
          y={310}
          style={{
            fontSize: 17,
            fill: "#cfcbd9",
            opacity: "50%",
            fontFamily: "GT Maru Trial",
          }}
          text={`H:${minMax.max}° L:${minMax.min}°`}
        />
      </VictoryChart>
    </>
  );
};

export default ClockWeatherVis;
