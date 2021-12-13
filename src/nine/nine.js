const fs = require('fs')

class HeightMap {
  width
  height
  #map

  constructor({ map }) {
    this.map = map
    this.width = this.map[0].length
    this.height = this.map.length
  }

  point(i, j) {
    return {
      value: this.map[i][j],
      i,
      j,
    }
  }
}

const findAdjacentPoints = ({ heightMap, i, j }) => {
  let adjacentPoints = []

  if (i > 0) adjacentPoints.push(heightMap.point(i - 1, j))
  if (j > 0) adjacentPoints.push(heightMap.point(i, j - 1))
  if (i < heightMap.height - 1) adjacentPoints.push(heightMap.point(i + 1, j))
  if (j < heightMap.width - 1) adjacentPoints.push(heightMap.point(i, j + 1))

  return adjacentPoints
}

const findLowPoints = ({ heightMap }) => {
  const lowPoints = []

  for (let i = 0; i < heightMap.height; i++) {
    for (let j = 0; j < heightMap.width; j++) {
      const currentPoint = heightMap.point(i, j)
      const adjacentPoints = findAdjacentPoints({ heightMap, i, j })

      if (adjacentPoints.every(point => currentPoint.value < point.value)) {
        lowPoints.push(currentPoint)
      }
    }
  }

  return lowPoints
}

let _currentBasin = []
const _calculateBasinSize = ({ heightMap, startPoint }) => {
  _currentBasin.push(startPoint)

  const basinPoints = findAdjacentPoints({ heightMap, i: startPoint.i, j: startPoint.j })
    .filter(point => {
      return point.value < 9
        && point.value > startPoint.value
        && !_currentBasin.some(p => p.i === point.i && p.j === point.j)
    })

  for (basinPoint of basinPoints) {
    _calculateBasinSize({ heightMap, startPoint: basinPoint })
  }
}

const calculateBasinSize = ({ heightMap, startPoint }) => {
  _currentBasin = []
  _calculateBasinSize({ heightMap, startPoint })
  return _currentBasin.length
}

const partOne = ({ heightMap }) => {
  return findLowPoints({ heightMap })
    .map(point => point.value + 1)
    .reduce((acc, point) => acc + point)
}

const partTwo = ({ heightMap }) => {
  const basinSizes = []

  for (point of findLowPoints({ heightMap })) {
    basinSizes.push(calculateBasinSize({ heightMap, startPoint: point }))
  }

  return basinSizes.sort((a, b) => b - a).slice(0, 3).reduce((acc, size) => acc * size)
}

fs.readFile('src/nine/assets/nine.txt', (error, data) => {
  if (error) throw error

  const heightMapData = data
    .toString()
    .split('\n')
    .filter(d => d?.length > 0)
    .map(row => row.split('').map(height => parseInt(height, 10)))

  const heightMap = new HeightMap({ map: heightMapData })

  console.log(partOne({ heightMap }))
  console.log(partTwo({ heightMap }))
})
