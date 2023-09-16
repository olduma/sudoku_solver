class SudokuSolver {

    validate(puzzleString) {
        const regex = /[1-9.]/;

        if (!puzzleString) {
            return 'Required field missing'

        }
        if (puzzleString.length !== 81) {
            return 'Expected puzzle to be 81 characters long'
        }

        if (!puzzleString.split("").every(item => {
            return regex.test(item)
        })) {
            return 'Invalid characters in puzzle';
        }

        for (let i = 0; i < 9; i++) {
            if (
                hasDuplicateInRow(puzzleString, i) ||
                hasDuplicateInColumn(puzzleString, i) ||
                hasDuplicateInRegion(puzzleString, i)
            ) {
                return "Puzzle cannot be solved";
            }
        }
        return "Valid"; // If all checks pass, the string is valid

        function hasDuplicateInRow(puzzleString, row) {
            const rowValues = new Set();
            for (let col = 0; col < 9; col++) {
                const char = puzzleString[row * 9 + col];
                if (char !== '.' && rowValues.has(char)) {
                    return true; // Duplicate digit found in the row
                }
                rowValues.add(char);
            }
            return false; // No duplicate digits in the row
        }

        function hasDuplicateInColumn(puzzleString, col) {
            const colValues = new Set();
            for (let row = 0; row < 9; row++) {
                const char = puzzleString[row * 9 + col];
                if (char !== '.' && colValues.has(char)) {
                    return true; // Duplicate digit found in the column
                }
                colValues.add(char);
            }
            return false; // No duplicate digits in the column
        }

        function hasDuplicateInRegion(puzzleString, region) {
            const regionValues = new Set();
            const startRow = Math.floor(region / 3) * 3;
            const startCol = (region % 3) * 3;

            for (let row = startRow; row < startRow + 3; row++) {
                for (let col = startCol; col < startCol + 3; col++) {
                    const char = puzzleString[row * 9 + col];
                    if (char !== '.' && regionValues.has(char)) {
                        return true; // Duplicate digit found in the region
                    }
                    regionValues.add(char);
                }
            }
            return false; // No duplicate digits in the region
        }
    }

    checkRowPlacement(puzzleString, row, column, value) {
        // Convert row and column indices to 0-based indices
        row--;
        column--;

        // Check if the value is already present in the row
        const rowValues = puzzleString.slice(row * 9, row * 9 + 9).split('');
        return !rowValues.includes(value.toString());
    }

    checkColPlacement(puzzleString, row, column, value) {
        // Convert row and column indices to 0-based indices
        row--;
        column--;

        // Check if the value is already present in the column
        const colValues = [];
        for (let i = 0; i < 9; i++) {
            const index = i * 9 + column;
            colValues.push(puzzleString[index]);
        }

        return !colValues.includes(value.toString());
    }

    checkRegionPlacement(puzzleString, row, column, value) {
        // Convert row and column indices to 0-based indices
        row--;
        column--;

        // Calculate the top-left corner of the region
        const regionStartRow = Math.floor(row / 3) * 3;
        const regionStartCol = Math.floor(column / 3) * 3;

        // Check the region for conflicts
        for (let i = regionStartRow; i < regionStartRow + 3; i++) {
            for (let j = regionStartCol; j < regionStartCol + 3; j++) {
                if (puzzleString[i * 9 + j] === value.toString()) {
                    return false; // Conflict found
                }
            }
        }
        return true; // No conflicts found
    }



    solve(puzzleString) {
        const puzzle = puzzleString.split('').map((char) => (char === '.' ? 0 : parseInt(char)));
        if (this.backtrackSudoku(puzzle)) {
            return puzzle.join('');
        } else {
            return null; // No solution found
        }
    }

    backtrackSudoku(puzzle) {
        const emptyCell = this.findEmptyCell(puzzle);
        if (!emptyCell) {
            return true; // Puzzle is solved
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (this.isValidPlacement(puzzle, row, col, num)) {
                puzzle[row * 9 + col] = num;

                if (this.backtrackSudoku(puzzle)) {
                    return true;
                }

                puzzle[row * 9 + col] = 0; // Backtrack if the current placement doesn't lead to a solution
            }
        }

        return false; // No valid placement found
    }

    findEmptyCell(puzzle) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (puzzle[row * 9 + col] === 0) {
                    return [row, col];
                }
            }
        }
        return null; // No empty cell found
    }

    isValidPlacement(puzzle, row, col, num) {
        // Check row, column, and region for conflicts
        return (
            !this.usedInRow(puzzle, row, num) &&
            !this.usedInColumn(puzzle, col, num) &&
            !this.usedInRegion(puzzle, row - (row % 3), col - (col % 3), num)
        );
    }

    usedInRow(puzzle, row, num) {
        return puzzle.slice(row * 9, row * 9 + 9).includes(num);
    }

    usedInColumn(puzzle, col, num) {
        for (let row = 0; row < 9; row++) {
            if (puzzle[row * 9 + col] === num) {
                return true;
            }
        }
        return false;
    }

    usedInRegion(puzzle, startRow, startCol, num) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (puzzle[(row + startRow) * 9 + col + startCol] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    check(puzzle, coordinate, value) {
        const regex = /[1-9.]/;
        const coordinateRegex = /^[A-I][1-9]$/
        const valueRegex = /^[1-9]$/

        if (!puzzle || !coordinate || !value) {
            return 'Required field(s) missing'

        }
        if (puzzle.length !== 81) {
            return 'Expected puzzle to be 81 characters long'
        }

        if (!puzzle.split("").every(item => {
            return regex.test(item)
        })) {
            return 'Invalid characters in puzzle';
        }

        if (!coordinateRegex.test(coordinate)) {
            return 'Invalid coordinate'
        }

        if (!valueRegex.test(value)) {
            return 'Invalid value'
        }

        return "Valid"
    }

    convertCoordinate(coordinate) {
        const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        let row = letters.indexOf(coordinate[0]) + 1
        let column = parseInt(coordinate[1])
        return {row, column}
    }

    checkData (puzzle, coordinate, value) {
        let conflict = []
        let checkResult = this.check(puzzle, coordinate, value)
        if (checkResult !== "Valid") {
            return {error: checkResult}
        }

        let {row, column} = this.convertCoordinate(coordinate)

        let isEqual = puzzle[(((row - 1) * 9) + column) - 1] === value

        const isRowConflict = this.checkRowPlacement(puzzle, row, column, value)
        const isColumnConflict = this.checkColPlacement(puzzle, row, column, value)
        const isRegionConflict = this.checkRegionPlacement(puzzle, row, column, value)

        if (!isRowConflict) conflict.push('row')
        if (!isColumnConflict) conflict.push('column')
        if (!isRegionConflict) conflict.push('region')

        if (isEqual && !isRowConflict && !isColumnConflict && !isRegionConflict) {
            return {valid: true}
        }

        if (conflict.length > 0) {
            return {"valid": false, "conflict": conflict}
        }

        return {valid: true}
    }

    validateData (puzzle) {
        const validateResult = this.validate(puzzle)

        if (validateResult !== "Valid") {
            return {error: validateResult}
        } else {
            let solution = this.solve(puzzle)
            return {solution: solution}
        }
    }
}
module.exports = SudokuSolver;

