# Sudoku Solver API

This is a backend API for a Sudoku Solver application. It provides functionality for solving Sudoku puzzles and checking placements. The API follows the [REST](https://restfulapi.net/) architectural style.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Features

- Solve Sudoku puzzles
- Check the validity of a number placement on the Sudoku grid
- Follows RESTful principles
- CORS-enabled for easy frontend integration

## Technologies Used

- Node.js
- Express.js
- Body-parser
- Chai (for testing)
- CORS (Cross-Origin Resource Sharing)

## Installation

1. Clone the repository
2. Install dependencies
3. Create a .env file and configure environment variables as needed. You can use the .env.example file as a reference.
4. Start the server: npm start


The API will be available at http://localhost:3000 by default.

## Usage

The API provides endpoints for solving Sudoku puzzles and checking placements. You can integrate it with a frontend application to build a complete Sudoku Solver.

## API Endpoints

- **POST /api/solve**: Solve a Sudoku puzzle.
- **POST /api/check**: Check the validity of a number placement.

Detailed documentation for each endpoint can be found in the API documentation.

## Testing

To run tests, you can use the following command: npm test







