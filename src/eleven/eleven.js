const fs = require('fs')

const flashThreshold = 9

const getNeighbours = ({ octopi, i, j }) => {
  const rowCount = octopi.length
  const columnCount = octopi[0].length

  let neighbours = []

  if (i > 0) neighbours.push({ i: i - 1, j })
  if (i < rowCount - 1) neighbours.push({ i: i + 1, j })

  if (j > 0) neighbours.push({ i, j: j - 1 })
  if (j < columnCount - 1) neighbours.push({ i, j: j + 1 })

  if (i > 0 && j > 0) neighbours.push({ i: i - 1, j: j - 1 })
  if (i > 0 && j < columnCount - 1) neighbours.push({ i: i - 1, j: j + 1 })
  if (i < rowCount - 1 && j > 0) neighbours.push({ i: i + 1, j: j - 1 })
  if (i < rowCount - 1 && j < columnCount - 1) neighbours.push({ i: i + 1, j: j + 1 })

  return neighbours
}

const flashOctopus /* ara ara ( ͡° ͜ʖ ͡°) */ = ({ octopi, i, j }) => {
  const neighbours = getNeighbours({ octopi, i, j })
  let flashes = 1

  octopi[i][j] = 0

  for (neighbour of neighbours) {
    if (octopi[neighbour.i][neighbour.j] > 0) octopi[neighbour.i][neighbour.j] += 1
  }

  for (neighbour of neighbours) {
    if (octopi[neighbour.i][neighbour.j] > flashThreshold) {
      flashes += flashOctopus({ octopi, i: neighbour.i, j: neighbour.j })
    }
  }

  return flashes
}

const partOne = ({ octopi }) => {
  const totalSteps = 100
  let flashes = 0

  for (let step = 1; step <= totalSteps; step++) {
    octopi = octopi.map(row => row.map(octopus => octopus += 1))

    octopi.forEach((row, i) => {
      row.forEach((octopus, j) => {
        if (octopus > flashThreshold) {
          flashes += flashOctopus({ octopi, i, j })
        }
      })
    })
  }

  return flashes
}

const partTwo = ({ octopi }) => {
  const totalSteps = 1_000_000

  for (let step = 1; step <= totalSteps; step++) {
    octopi = octopi.map(row => row.map(octopus => octopus += 1))

    octopi.forEach((row, i) => {
      row.forEach((octopus, j) => {
        if (octopus > flashThreshold) flashOctopus({ octopi, i, j })
      })
    })

    if (octopi.every(row => row.every(octopus => octopus === 0))) {
      return step
    }
  }

  throw `No synchronization found after ${totalSteps} steps :(`
}

fs.readFile('src/eleven/assets/eleven.txt', (error, data) => {
  if (error) throw error

  const octopi = data
    .toString()
    .split('\n')
    .filter(d => d?.length > 0)
    .map(row => row.split('').map(octopus => parseInt(octopus, 10)))

  console.log(partOne({ octopi }))
  console.log(partTwo({ octopi }))
})
