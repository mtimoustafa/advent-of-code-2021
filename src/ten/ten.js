const fs = require('fs')

const characterMap = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}

const openingCharacters = Object.keys(characterMap)
const closingCharacters = Object.values(characterMap)

const validateLine = line => {
  const result = {
    valid: true,
    badCloser: null,
  }

  let lineStack = []

  for (character of line) {
    if (openingCharacters.includes(character)) {
      lineStack.push(character)
    } else if (closingCharacters.includes(character)) {
      const matchingCharacter = lineStack.pop(character)

      if (!matchingCharacter || characterMap[matchingCharacter] !== character) {
        result.valid = false
        result.badCloser = character
      }
    }

    if (!result.valid) break
  }

  return result
}

const scoreIncompleteLine = line => {
  const autoCompletionScores = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
  }

  let lineStack = []

  for (character of line) {
    if (openingCharacters.includes(character)) lineStack.push(character)
    else if (closingCharacters.includes(character)) lineStack.pop(character)
  }

  return lineStack.reverse().reduce((acc, val) => (acc * 5) + autoCompletionScores[val], 0)
}

const partOne = ({ lines }) => {
  const characterPoints = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  }

  let badClosers = []

  for (line of lines) {
    const lineResult = validateLine(line)
    if (!lineResult.valid) badClosers.push(lineResult.badCloser)
  }

  return badClosers.reduce((acc, val) => acc + characterPoints[val], 0)
}

const partTwo = ({ lines }) => {
  let validLines = []
  for (line of lines) if (validateLine(line).valid) validLines.push(line)

  let scores = validLines.map(line => scoreIncompleteLine(line))
  return scores.sort((a, b) => a - b)[Math.ceil(scores.length / 2.0) - 1]
}

fs.readFile('src/ten/assets/ten.txt', (error, data) => {
  if (error) throw error

  const lines = data
    .toString()
    .split('\n')
    .filter(d => d?.length > 0)
    .map(syntax => syntax.split(''))

  console.log(partOne({ lines }))
  console.log(partTwo({ lines }))
})
