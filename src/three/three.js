const fs = require('fs')

const partOne = numbers => {
  let gamma = 0b1 // Start with first bit set to 1 to left shift correctly
  let epsilon = 0b0

  for (let i = 0; i < numbers[0].length; i++) {
    let bitDifference = 0

    for (let j = 0; j < numbers.length; j++) {
      bitDifference += parseInt(numbers[j][i]) ? 1 : -1
    }

    gamma <<= 1
    gamma += bitDifference >= 0 // Add a 1 if more 1s than 0s, otherwise add a 0
  }

  gamma &= ~(1 << numbers[0].length) // Clear highest bit that we set before

  const inverter = parseInt('1'.repeat(numbers[0].length), 2) // bit-inverting mask for XOR
  epsilon = gamma ^ inverter // epsilon is basically a bit-inverted gammma

  return { gamma, epsilon }
}

const partTwo = (numbers, bitCriteria) => {
  let filteredNumbers = [...numbers]

  for (let i = 0; i < filteredNumbers[0].length; i++) {
    let bitDifference = 0

    for (let j = 0; j < filteredNumbers.length; j++) {
      bitDifference += parseInt(filteredNumbers[j][i]) ? 1 : -1
    }

    let columnMask = bitDifference >= 0
    if (bitCriteria === 'o2') columnMask = !columnMask
    columnMask = columnMask ? '1' : '0'

    filteredNumbers = filteredNumbers.filter(b => b[i] === columnMask)
    if (filteredNumbers.length === 1) return parseInt(filteredNumbers[0], 2)
  }

  throw 'WTF did we not find a bit?'
}

fs.readFile('src/three/assets/three.txt', (error, data) => {
  if (error) throw error

  const numbers = data
    .toString()
    .split('\n')
    .filter(d => d != null && d.length > 0)

  const { gamma, epsilon } = partOne(numbers)
  console.log(gamma * epsilon)

  console.log(partTwo(numbers, 'o2') * partTwo(numbers, 'co2'))
})
