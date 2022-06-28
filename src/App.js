import "./App.css";
import React from "react";
import ClockWeatherVis from "./Components/ClockWeatherVis";
import PollenGauge from "./Components/PollenGauge";

function App() {
  return (
    <div className="App">
      <ClockWeatherVis />
      {/* <PollenGauge /> */}
    </div>
  );
}

export default App;
