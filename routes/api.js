'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

    let solver = new SudokuSolver();

    app.route('/api/check')
        .post((req, res) => {
            let {puzzle, coordinate, value} = req.body
            let data = solver.checkData(puzzle, coordinate, value)
            return res.json(data)
        });

    app.route('/api/solve')
        .post((req, res) => {
            let puzzle = req.body.puzzle
            let data = solver.validateData(puzzle)
            return res.json(data)
        });
};
