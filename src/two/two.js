const fs = require('fs')

const partOne = directions => {
  let position = 0
  let depth = 0

  directions.forEach(([ direction, quantity ]) => {
    switch (direction) {
      case 'forward':
        position += parseInt(quantity)
        break;
      case 'down':
        depth += parseInt(quantity)
        break;
      case 'up':
        depth -= parseInt(quantity)
        break;
      default:
        throw `Bad direction: ${direction}`
    }
  })

  return { position, depth }
}

const partTwo = directions => {
  let position = 0
  let depth = 0
  let aim = 0

  directions.forEach(([ direction, quantity ]) => {
    switch (direction) {
      case 'forward':
        position += parseInt(quantity)
        depth += aim * parseInt(quantity)
        break;
      case 'down':
        aim += parseInt(quantity)
        break;
      case 'up':
        aim -= parseInt(quantity)
        break;
      default:
        throw `Bad direction: ${direction}`
    }
  })

  return { position, depth }
}

fs.readFile('src/two/assets/two.txt', (error, data) => {
  if (error) throw error

  const directions = data
    .toString()
    .split('\n')
    .filter(d => d != null && d.length > 0)
    .map(d => d.split(' '))

  const { position, depth } = partOne(directions)
  console.log(position, depth, position * depth)

  const { position: position2, depth: depth2 } = partTwo(directions)
  console.log(position2, depth2, position2 * depth2)
})
