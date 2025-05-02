// Function to generate exponential decline curve
const exponentialDecline = (qi: number, d: number, t: number) => {
  return qi * Math.exp(-d * t)
}

// Function to add noise to a value
const addNoise = (value: number, noiseLevel: number) => {
  const noise = (Math.random() - 0.5) * 2 * noiseLevel * value
  return value + noise
}

// Generate well production data with P10, P50, P90 percentiles
export const generateWellData = (days: number) => {
  const data = []

  // Initial rates and decline parameters
  const p10InitialRate = 4000 // Lower case
  const p50InitialRate = 5000 // Median case
  const p90InitialRate = 6500 // Higher case

  const p10Decline = 0.0005
  const p50Decline = 0.0002
  const p90Decline = 0.0001

  // Generate data for each day
  
  for (let day = 0; day < days; day++) {
    // Calculate base values from exponential decline model
    const p10Base = exponentialDecline(p10InitialRate, p10Decline, day)
    const p50Base = exponentialDecline(p50InitialRate, p50Decline, day)
    const p90Base = exponentialDecline(p90InitialRate, p90Decline, day)

    // Add noise to create realistic production data
    const p10 = addNoise(p10Base, 0.05)
    const p50 = addNoise(p50Base, 0.08)
    const p90 = addNoise(p90Base, 0.06)

    // Exponential fit lines (smoother)
    const p10Fit = exponentialDecline(p10InitialRate, p10Decline, day)
    const p50Fit = exponentialDecline(p50InitialRate, p50Decline, day)
    const p90Fit = exponentialDecline(p90InitialRate, p90Decline, day)

    data.push({
      day,
      p10,
      p50,
      p90,
      p10Fit,
      p50Fit,
      p90Fit,
      // For the area between P10 and P90
      range: [p10, p90],
    })
  }
  const newdata= data.slice(0, Math.min(days, 365))

  

  return newdata// Limit to 365 days for better visualization
}

// Generate a larger dataset with 1000 points
export const generateFullWellData = () => {
  return generateWellData(1000)
}
