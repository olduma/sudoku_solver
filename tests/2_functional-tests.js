const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const app = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve puzzle with valid puzzle string', (done) => {
        chai.request(app)
            .post('/api/solve')
            .send({ puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'solution');
                assert.equal(res.body.solution.length, 81);
                done();
            });
    });

    test('Solve puzzle with missing puzzle string', (done) => {
        chai.request(app)
            .post('/api/solve')
            .send({}) // Missing puzzle string
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });

    test('Solve puzzle with invalid characters', (done) => {
        chai.request(app)
            .post('/api/solve')
            .send({ puzzle: "53..7....6..19X....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..53" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    test('Solve puzzle with incorrect length', (done) => {
        chai.request(app)
            .post('/api/solve')
            .send({ puzzle: "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5...7..53" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    test('Solve unsolvable puzzle', (done) => {
        chai.request(app)
            .post('/api/solve')
            .send({ puzzle: "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6.99.28....419..5....7..53" })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                done();
            });
    });

    test('Check puzzle placement with all fields correct', (done) => {
        const puzzle = ".34678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";
        const value = "5";

        chai.request(app)
            .post('/api/check')
            .send({ puzzle, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('Check puzzle placement with one placement conflict', (done) => {
        const puzzle = ".34678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";
        const value = "3";

        chai.request(app)
            .post('/api/check')
            .send({ puzzle, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
                done();
            });
    });

    test('Check puzzle placement with multiple placement conflicts', (done) => {
        const puzzleString = ".34678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";
        const value = "3";

        chai.request(app)
            .post('/api/check')
            .send({ puzzle: puzzleString, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
                done();
            });
    });

    test('Check puzzle placement with all placement conflicts', (done) => {
        const puzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";
        const value = "9";

        chai.request(app)
            .post('/api/check')
            .send({ puzzle: puzzleString, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
                done();
            });
    });

    test('Check puzzle placement with missing required fields', (done) => {
        const puzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";

        chai.request(app)
            .post('/api/check')
            .send({ puzzle: puzzleString, coordinate }) // Missing 'value' field
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Check puzzle placement with invalid characters', (done) => {
        const puzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";
        const value = "X";

        chai.request(app)
            .post('/api/check')
            .send({ puzzle: puzzleString, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });

    test('Check puzzle placement with invalid coordinate', (done) => {
        const puzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "K1"; // Invalid coordinate
        const value = "1";

        chai.request(app)
            .post('/api/check')
            .send({ puzzle: puzzleString, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            });
    });

    test('Check puzzle placement with invalid value', (done) => {
        const puzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";
        const value = "0"; // Invalid value

        chai.request(app)
            .post('/api/check')
            .send({ puzzle: puzzleString, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });

    test('Check puzzle placement with invalid data', (done) => {
        const puzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
        const coordinate = "A1";
        const value = "0"; // Invalid value

        chai.request(app)
            .post('/api/check')
            .send({ puzzle: puzzleString, coordinate, value })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });
});
