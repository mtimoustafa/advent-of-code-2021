const fs = require('fs')

const partOne = depths => {
  let increases = 0
  depths.forEach((depth, index) => {
    if (index === 0) return
    if (depth > depths[index - 1]) increases += 1
  })
  return increases
}

const partTwo = depths => {
  let increases = 0
  depths.forEach((depth, index) => {
    if (index < 1) return
    if (depth > depths[index - 3]) increases += 1
  })
  return increases
}

fs.readFile('src/one/assets/one.txt', (error, data) => {
  if (error) throw error

  const depths = data
    .toString()
    .split('\n')
    .filter(d => d != null && d.length > 0)
    .map(d => parseInt(d))

  console.log(partOne(depths))
  console.log(partTwo(depths))
})
