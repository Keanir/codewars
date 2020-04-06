const checkRow = (arr, i, val) => {
    for (let t = 0; t < 9; t += 1) {
        if (arr[i][t] === val) return false
    }
    return true
}

const checkColumn = (arr, j, val) => {
    for (let t = 0; t < 9; t += 1) {
        if (arr[t][j] === val) return false
    }
    return true
}

const checkSquare = (arr, i, j, val) => {
    let row = Math.floor(i / 3)
    let col = Math.floor(j / 3)

    for (let r = row * 3; r < row * 3 + 3; r += 1) {
        for (let c = col * 3; c < col * 3 + 3; c += 1) {
            if (arr[r][c] === val) return false
        }
    }
    return true
}

const validate = (arr, i, j, val) => {
    return (checkRow(arr, i, val) && checkColumn(arr, j, val) && checkSquare(arr, i, j, val))
}

const solve = (arr, i, j) => {

    if (i === 9) {
        i = 0
        j += 1
        if (j === 9) return true
    }

    if (arr[i][j] > 0) return solve(arr, i + 1, j)

    for (let x = 1; x < 10; x += 1) {
        if (validate(arr, i, j, x)) {
            arr[i][j] = x
            if (solve(arr, i + 1, j)) return true
        }
    }

    arr[i][j] = 0
    return false
}

const sudoku = (arr) => {
    return (solve(arr, 0, 0)) ? arr : null
}

console.log(sudoku(puzzle))


// const checkSquare = (arr, i, j, value) => {
//     let x = (Math.floor(i / 3) * 3) + 3
//     let y = (Math.floor(j / 3) * 3) + 3

//     for (let a = x; a < x; a += 1) {
//         for (let b = y; b < y; b += 1) {
//             if (arr[a][b] === value) return false
//         }
//     }
//     return true
// }

// const check = (arr, i, j, value, len) => {

//     for (let x = 0; x < len; x += 1) {
//         if (arr[x][j] === value) return false
//     }

//     for (let y = 0; y < len; y += 1) {
//         if (arr[i][y] === value) return false
//     }

//     return checkSquare(arr, i, j, value)
// }

// const getLength = (arr) => {
//     return arr[0].length
// }

// const solve = (arr, i, j, len) => {
//     if (i === len) {
//         j += 1
//         i = 0
//         if (j === len) return true;
//     }

//     if (arr[i][j] > 0) return solve(arr, i + 1, j, len)

//     for (let n = 1; n <= len; n += 1) {
//         if (check(arr, i, j, n, len)) {
//             arr[i][j] = n
//             if (solve(arr, i + 1, j, len)) return true
//         }
//     }
//     arr[i][j] = 0
//     return false
// }

// const sudoku = (puzzle) => {
//     let arr = JSON.parse(JSON.stringify(puzzle))
//     //console.log(getLength(arr))
//     return (solve(puzzle, 0, 0, getLength(puzzle))) ? puzzle : null
// }