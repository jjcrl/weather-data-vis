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

import { fetch12HForecastData, fetchCurrData } from "./api";

function App() {
  const [hourly, setHourly] = useState();
  const [day, setDay] = useState();
  const [curr, setCurr] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch12HForecastData().then((data) => {
      setHourly(data);
    });

    fetchCurrData().then((data) => {
      setCurr(data);
    });

    setLoading(false);
  }, []);

  if (loading) return <p>loader</p>;
  else
    return (
      <div className="App">
        <VictoryChart polar>
          <VictoryPolarAxis
            style={{
              axis: { stroke: "grey" },
              tickLabels: { fontSize: 10, padding: 20 },
            }}
            tickValues={[
              1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 3.0,
              3.1, 3.2, 3.3, 3.4, 3.5, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 5.0, 5.1,
              5.2, 5.3, 5.4, 5.5, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 7.0, 7.1, 7.2,
              7.3, 7.4, 7.5, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 9.0, 9.1, 9.2, 9.3,
              9.4, 9.5, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5, 11.0, 11.1, 11.2,
              11.3, 11.4, 11.5, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5,
            ]}
            labelPlacement={"horizontal"}
          />
          <VictoryPolarAxis
            dependentAxis
            // axisValue={curr.time}
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
          <VictoryLabel
            // text={`${hourly[0].temp}`}
            datum={{ x: 0, y: 0 }}
            backgroundStyle={{ fill: "whitesmoke" }}
            backgroundPadding={5}
          />
        </VictoryChart>
      </div>
    );
}

export default App;
