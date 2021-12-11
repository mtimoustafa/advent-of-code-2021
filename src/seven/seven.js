const fs = require('fs')

const calculateOptimalFuelUsage = ({ crabPositions, exponentialCost = false }) => {
  let fuelCosts = new Array(Math.max(...crabPositions) + 1)

  for (let targetPosition = 0; targetPosition <= Math.max(...crabPositions); targetPosition++) {
    fuelCosts[targetPosition] = 0

    for (position of crabPositions) {
      const positionDifference = Math.abs(position - targetPosition)

      if (exponentialCost) {
        // Infinite series!
        fuelCosts[targetPosition] += positionDifference * (positionDifference + 1) / 2
      } else {
        fuelCosts[targetPosition] += positionDifference
      }
    }
  }

  return Math.min(...fuelCosts)
}

const partOne = ({ crabPositions }) => {
  return calculateOptimalFuelUsage({ crabPositions })
}

const partTwo = ({ crabPositions }) => {
  return calculateOptimalFuelUsage({ crabPositions, exponentialCost: true })
}

fs.readFile('src/seven/assets/seven.txt', (error, data) => {
  if (error) throw error

  let crabPositions = data
    .toString()
    .split(',')
    .filter(d => d?.length > 0)
    .map(crabPosition => parseInt(crabPosition, 10))

  console.log(partOne({ crabPositions }))
  console.log(partTwo({ crabPositions }))
})
