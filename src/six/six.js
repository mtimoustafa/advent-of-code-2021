const fs = require('fs')

const fishSpawnTime = 6
const newFishAge = 8
const longestAge = Math.max(newFishAge, fishSpawnTime)

const partOne = ({ fishes, days }) => {
  let fishPool = Object.assign([], fishes)

  for (let day = 0; day < days; day++) {
    let newFishes = []

    for (let fishIndex = 0; fishIndex < fishPool.length; fishIndex++) {
      fishPool[fishIndex] -= 1

      if (fishPool[fishIndex] < 0) {
        fishPool[fishIndex] = fishSpawnTime
        newFishes.push(newFishAge)
      }
    }

    fishPool = fishPool.concat(newFishes)
  }

  return fishPool.length
}

const partTwo = ({ fishes, days }) => {
  let fishPool = {}
  for (let age = 0; age <= longestAge; age++) {
    fishPool[age] = 0
  }

  for (fish of fishes) {
    fishPool[fish] = fishPool[fish] + 1
  }

  for (let day = 0; day < days; day++) {
    let newFishPool = Object.assign({}, fishPool)
    for (ageGroup in fishPool) {
      const age = parseInt(ageGroup, 10)

      if (age === newFishAge) {
        newFishPool[newFishAge] = fishPool[0]
      } else if (age === fishSpawnTime) {
        newFishPool[fishSpawnTime] = fishPool[0] + fishPool[age + 1]
      } else {
        newFishPool[age] = fishPool[age + 1]
      }
    }

    fishPool = newFishPool
  }

  return Object.values(fishPool).reduce((acc, fishes) => acc + fishes)
}

fs.readFile('src/six/assets/six.txt', (error, data) => {
  if (error) throw error

  let fishes = data
    .toString()
    .split(',')
    .filter(d => d?.length > 0)
    .map(fish => parseInt(fish, 10))

  console.log(partOne({ fishes, days: 80 }))
  console.log(partTwo({ fishes, days: 256 }))
})
