// export const generateTemperatureGradient = (hourlyData, minTemp, maxTemp) => {
//   const coldColor = { h: 254, s: 48, l: 52 };
//   const hotColor = { h: 11, s: 89, l: 52 };
  
//   return hourlyData.map((hour, index) => {
//     const normalized = (hour.temp - minTemp) / (maxTemp - minTemp);
    
//     const h = Math.round(coldColor.h + (hotColor.h - coldColor.h) * normalized);
//     const s = Math.round(coldColor.s + (hotColor.s - coldColor.s) * normalized);
//     const l = Math.round(coldColor.l + (hotColor.l - coldColor.l) * normalized);
    
//     // Calculate angle position around the circle (0deg to 360deg)
//     const angle = (index / hourlyData.length) * 360;
    
//     return {
//       offset: `${Math.round(angle)}deg`,  // Use degrees instead of percentages
//       color: `hsl(${h}, ${s}%, ${l}%)`
//     };
//   });
// };

  export const findMinMaxTemp = (arrOfObjs) => {
    const temps = arrOfObjs.map((d) => {
      return d.temp;
    });
    const sorted = temps.sort((a, b) => a - b);
    let [min] = sorted;
    min = Math.floor(min);
    const max = Math.ceil(sorted[sorted.length - 1]);
    return { min, max };
  };

export const findSunPhases = (a, b) => {
  const data = [];
  const baselineValue = 0;
  const maxSunValue = 10;
  const twilightOffset = 0.5;

  
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
    
    let sunIntensity = baselineValue; // DEFAULT TO NIGHTTIME
    
    if (hour >= (sunriseHour - twilightOffset) && hour < sunriseHour) {
      // Pre-dawn glow
      const progress = (hour - (sunriseHour - twilightOffset)) / twilightOffset;
      sunIntensity = progress * (maxSunValue * 0.3);
    } else if (hour > sunsetHour && hour <= (sunsetHour + twilightOffset)) {
      // Post-dusk glow
      const progress = 1 - ((hour - sunsetHour) / twilightOffset);
      sunIntensity = progress * (maxSunValue * 0.3);
    } else if (hour >= sunriseHour && hour <= sunsetHour) {
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