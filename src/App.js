import "./App.css";
import { useEffect, useState } from "react";
import React from "react";
import {
  VictoryArea,
  VictoryChart,
  VictoryPolarAxis,
  VictoryLabel,
  VictoryLegend,
  LineSegment,
  Rect,
} from "victory";

import { fetch12HForecastData } from "./api";

function App() {
  const [hourly, setHourly] = useState();
  const [day, setDay] = useState();
  const [curr, setCurr] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch12HForecastData().then((data) => {
      setHourly(data);
    });
    setLoading(false);
  }, []);

  if (loading) return <p>hello laoding one moment please xx</p>;
  else
    return (
      <div className="App">
        <VictoryChart polar>
          <VictoryPolarAxis
            style={{
              axis: { stroke: "grey" },
            }}
            tickCount={12}
            labelPlacement={"vertical"}
          />
          <VictoryPolarAxis
            dependentAxis
            // axisValue={hourly[0].time}
            tickCount={1}
            style={{
              axis: {
                stroke: "blue",
              },
            }}
          />
          <VictoryArea
            labelComponent={<VictoryLabel />}
            data={hourly}
            x="time"
            y="temp"
            interpolation={"basis"}
            style={{
              data: {
                fill: "none",
                stroke: "red",
                strokeWidth: "0.5",
              },
            }}
          />
          {/* <VictoryLabel
            // text={`${hourly[0].temp} ${hourly[0].phrase}`}
            datum={{ x: 0, y: 0 }}
            backgroundStyle={{ fill: "pink" }}
            backgroundPadding={5}
          /> */}
        </VictoryChart>
      </div>
    );
}

export default App;
