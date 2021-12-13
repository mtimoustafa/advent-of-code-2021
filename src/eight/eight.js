const fs = require('fs')

const uniqueSegmentLengths = [2, 3, 4, 7]

const sort = signal => signal.split('').sort().join('')

const difference = (minuend, subtrahend) => {
  return minuend.split('').filter(wire => !subtrahend.includes(wire))
}

const checkContains = (container, containee) => {
  return containee.split('').every(wire => container.includes(wire))
}

const decodePatterns = (patterns) => {
  let signalMap = {}

  // only 2-segment signal
  signalMap[1] = sort(patterns.find(o => o.length === 2))
  // only 3-segment signal
  signalMap[7] = sort(patterns.find(o => o.length === 3))
  // only 4-segment signal
  signalMap[4] = sort(patterns.find(o => o.length === 4))
  // only 7-segment signal
  signalMap[8] = sort(patterns.find(o => o.length === 7))

  // only 6-segment signal including 4
  signalMap[9] = sort(patterns.find(o => {
    return o.length === 6 && checkContains(o, signalMap[4])
  }))
  // only remaining 6-segment signal including 7
  signalMap[0] = sort(patterns.find(o => {
    return o.length === 6
      && sort(o) !== signalMap[9]
      && checkContains(o, signalMap[7])
  }))
  // only remaining 6-segment signal
  signalMap[6] = sort(patterns.find(o => {
    return o.length === 6 && sort(o) !== signalMap[9] && sort(o) !== signalMap[0]
  }))

  // only 5-segment signal including 7
  signalMap[3] = sort(patterns.find(o => {
    return o.length === 5 && checkContains(o, signalMap[7])
  }))
  // only remaining 5-segment signal including 7 - 1 + 8 - 9
  signalMap[2] = sort(patterns.find(o => {
    return o.length === 5
      && sort(o) !== signalMap[3]
      && checkContains(o, difference(signalMap[7], signalMap[1]) + difference(signalMap[8], signalMap[9]))
  }))
  // only remaining 5-segment signal
  signalMap[5] = sort(patterns.find(o => {
    return o.length === 5
      && sort(o) !== signalMap[3]
      && sort(o) !== signalMap[2]
  }))

  let segmentsMap = {}
  for (digit in signalMap) {
    segmentsMap[signalMap[digit]] = digit
  }

  return segmentsMap
}

const partOne = ({ signals }) => {
  let uniqueDigitCount = 0

  for (signal of signals) {
    uniqueDigitCount += signal.outputs.filter(output => uniqueSegmentLengths.includes(output.length)).length
  }

  return uniqueDigitCount
}

const partTwo = ({ signals }) => {
  let digitTotal = 0

  for (signal of signals) {
    const segmentsMap = decodePatterns(signal.patterns)

    let digits = ''
    for (output of signal.outputs) {
      digits += segmentsMap[sort(output)]
    }
    console.log(parseInt(digits))
    digitTotal += parseInt(digits, 10)
  }

  return digitTotal
  // TODO: digits are borked in an inconsistent way :(
}

fs.readFile('src/eight/assets/eight.txt', (error, data) => {
  if (error) throw error

  let signalFeed = data
    .toString()
    .split('\n')
    .filter(d => d?.length > 0)

  let signals = []
  for (signal of signalFeed) {
    const signalParts = signal.split(' | ')

    signals.push({
      patterns: signalParts[0].split(' '),
      outputs: signalParts[1].split(' '),
    })
  }

  console.log(partOne({ signals }))
  console.log(partTwo({ signals }))
})
