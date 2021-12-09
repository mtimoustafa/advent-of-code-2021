const fs = require('fs')

const coordinateString = coordinate => `${coordinate[0]},${coordinate[1]}`

const countLineIntersections = ({ lines, countDiagonals }) => {
  let plottedLines = {}

  lines.forEach(([ coordinateStart, coordinateEnd ]) => {
    let startPoint, endPoint
    let iLength = parseInt(coordinateEnd[0]) - parseInt(coordinateStart[0])
    let jLength = parseInt(coordinateEnd[1]) - parseInt(coordinateStart[1])

    if (coordinateStart[0] === coordinateEnd[0]) {
      startPoint = Math.min(coordinateStart[1], coordinateEnd[1])
      endPoint = Math.max(coordinateStart[1], coordinateEnd[1])

      for (let j = startPoint; j <= endPoint; j++) {
        const coordinates = coordinateString([coordinateStart[0], j])

        if (!plottedLines[coordinates]) plottedLines[coordinates] = 0
        plottedLines[coordinates] += 1
      }
    } else if (coordinateStart[1] === coordinateEnd[1]) {
      startPoint = Math.min(coordinateStart[0], coordinateEnd[0])
      endPoint = Math.max(coordinateStart[0], coordinateEnd[0])

      for (let i = startPoint; i <= endPoint; i++) {
        const coordinates = coordinateString([i, coordinateStart[1]])

        if (!plottedLines[coordinates]) plottedLines[coordinates] = 0
        plottedLines[coordinates] += 1
      }
    } else if (countDiagonals && Math.abs(iLength) === Math.abs(jLength)) {
      const iGradient = iLength / Math.abs(iLength)
      const jGradient = jLength / Math.abs(jLength)

      for (let i = 0; i <= Math.abs(iLength); i++) {
        const iCoordinate = parseInt(coordinateStart[0]) + iGradient * i
        const jCoordinate = parseInt(coordinateStart[1]) + jGradient * i
        const coordinates = coordinateString([ iCoordinate, jCoordinate ])

        if (!plottedLines[coordinates]) plottedLines[coordinates] = 0
        plottedLines[coordinates] += 1
      }
    }
  })

  return Object.values(plottedLines).filter(v => v > 1).length
}

const partOne = ({ lines }) => {
  return countLineIntersections({ lines, countDiagonals: false })
}

const partTwo = ({ lines }) => {
  return countLineIntersections({ lines, countDiagonals: true })
}

fs.readFile('src/five/assets/five.txt', (error, data) => {
  if (error) throw error

  let lines = data
    .toString()
    .split('\n')
    .filter(d => d?.length > 0)

  lines = lines.map(line => line.split(' -> ').map(coordinates => coordinates.split(',')))
  console.log(partOne({ lines }))
  console.log(partTwo({ lines }))
})
