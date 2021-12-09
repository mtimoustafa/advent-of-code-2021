const fs = require('fs')

const constructCompletionMap = boards => {
  const boardCount = boards.length
  const boardDimensions = boards[0].length

  return new Array(boardCount).fill().map(() => {
    return {
      rowCompletion: new Array(boardDimensions).fill(0),
      columnCompletion: new Array(boardDimensions).fill(0),
      boardCompletion: new Array(boardDimensions).fill().map(() => new Array(boardDimensions).fill(false)),
      completed: false,
    }
  })
}

const runBingo = ({ numbers, boards, letSquidWin }) => {
  const boardDimensions = boards[0].length
  let completionMaps = constructCompletionMap(boards)
  let winningBoard

  for (let numberIndex = 0; numberIndex < numbers.length; numberIndex++) {
    const number = numbers[numberIndex]

    for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
      const board = boards[boardIndex]
      const rowIndex = board.findIndex(row => row.includes(number))

      const completionMap = completionMaps[boardIndex]

      if (rowIndex > -1) {
        const columnIndex = board[rowIndex].findIndex(num => num === number)

        completionMap.rowCompletion[rowIndex] += 1
        completionMap.columnCompletion[columnIndex] += 1
        completionMap.boardCompletion[rowIndex][columnIndex] = true

        if (completionMap.rowCompletion[rowIndex] === boardDimensions
            || completionMap.columnCompletion[columnIndex] === boardDimensions) {
          completionMap.completed = true

          const boardInfo = {
            boardIndex,
            lastNumber: number,
            completionMap: completionMap.boardCompletion,
          }

          if (!letSquidWin) return boardInfo

          const remainingBoards = completionMaps.filter(({ completed }) => !completed)

          if (remainingBoards.length === 1) {
            winningBoard = remainingBoards[0]
          } else if (remainingBoards.length === 0) {
            boardInfo.completionMap = winningBoard.boardCompletion
            return boardInfo
          }
        }
      }
    }
  }
}

const getBoardScore = ({ board, lastNumber, completionMap }) => {
  let unmarkedSum = 0

  completionMap.forEach((row, rowIndex) => {
    row.forEach((numberMarked, columnIndex) => {
      if (!numberMarked) unmarkedSum += parseInt(board[rowIndex][columnIndex])
    })
  })

  return unmarkedSum * parseInt(lastNumber)
}

const partOne = ({ numbers, boards }) => {
  const { boardIndex, lastNumber, completionMap } = runBingo({ numbers, boards, letSquidWin: false })
  return getBoardScore({ board: boards[boardIndex], lastNumber, completionMap })
}

const partTwo = ({ numbers, boards }) => {
  const { boardIndex, lastNumber, completionMap } = runBingo({ numbers, boards, letSquidWin: true })
  return getBoardScore({ board: boards[boardIndex], lastNumber, completionMap })
}

fs.readFile('src/four/assets/four.txt', (error, data) => {
  if (error) throw error

  let [ numbers, ...boards ] = data
    .toString()
    .split('\n\n')
    .filter(d => d?.length > 0)

  numbers = numbers.split(',')
  boards = boards.map(board => {
    return board.split('\n').map(row => {
      return row.split(/\s+/).filter(num => num?.length > 0)
    }).filter(row => row?.length > 0)
  })

  console.log(partOne({ numbers, boards }))
  console.log(partTwo({ numbers, boards }))
})
