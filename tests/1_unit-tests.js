const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver;

suite('Unit Tests', () => {
    before(() => {
        solver = new SudokuSolver();
    });

    test('Valid puzzle string with 81 characters', () => {
        const puzzleString = "3..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53";
        const result = solver.validate(puzzleString);
        assert.strictEqual(result, 'Expected puzzle to be 81 characters long');
    });

    test('Invalid puzzle string with invalid characters', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....41X..5....7..53";
        const result = solver.validate(puzzleString);
        assert.strictEqual(result, 'Invalid characters in puzzle');
    });

    test('Puzzle string with incorrect length', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5...7..53";
        const result = solver.validate(puzzleString);
        assert.strictEqual(result, 'Expected puzzle to be 81 characters long');
    });

    test('Valid row placement', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53";
        const result = solver.checkRowPlacement(puzzleString, 1, 1, 2);
        assert.isTrue(result);
    });

    test('Invalid row placement', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53";
        const result = solver.checkRowPlacement(puzzleString, 1, 1, 5);
        assert.isFalse(result);
    });

    test('Valid column placement', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53";
        const result = solver.checkColPlacement(puzzleString, 1, 1, 2);
        assert.isTrue(result);
    });

    test('Invalid column placement', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53";
        const result = solver.checkColPlacement(puzzleString, 1, 1, 5);
        assert.isFalse(result);
    });

    test('Valid region placement', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53";
        const result = solver.checkRegionPlacement(puzzleString, 1, 1, 2);
        assert.isTrue(result);
    });

    test('Invalid region placement', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53";
        const result = solver.checkRegionPlacement(puzzleString, 1, 1, 5);
        assert.isFalse(result);
    });

    test('Valid puzzle string can be solved', () => {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const result = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
        const solution = solver.solve(puzzleString);
        assert.equal(solution, result);
    });

    test('Invalid puzzle string cannot be solved', () => {
        const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5...7..53";
        const solution = solver.solve(puzzleString);
        assert.isNull(solution);
    });

    test('Solver returns a solution for an unsolved puzzle', () => {
        const unsolvedPuzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const solvedPuzzleString = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

        const solution = solver.solve(unsolvedPuzzleString);
        assert.strictEqual(solution, solvedPuzzleString);
    });

});
