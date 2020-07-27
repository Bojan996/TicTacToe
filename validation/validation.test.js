const validation = require('./validation');
const initialState = require('../initialState');

// //SETTING UP VARIABLES
const board = initialState.board();
const winnerPatterns = [
    [11, 21, 31], 
    [12, 22, 32], 
    [13, 23, 33], 
    [11, 12, 13],
    [21, 22, 23], 
    [31, 32, 33], 
    [11, 22, 33], 
    [31, 22, 13]
];
const boardChanger = (positionsX, positionsO, testBoard) => {
    const object = {...testBoard};
    positionsX.map(e => object[e] = 'X');
    positionsO.map(e => object[e] = 'O');
    return object;
}



// //PLAYER MOVE VALIDATOR

test('returns false: when input contains any kind of letters or symblos', () => {
    expect(validation.playerMoveValidator('sdfsdf', board)).toBeFalsy();
    expect(validation.playerMoveValidator('/2 2/', board)).toBeFalsy();
    expect(validation.playerMoveValidator('\d1 2', board)).toBeFalsy();
    expect(validation.playerMoveValidator('1\n2,3', board)).toBeFalsy();
    expect(validation.playerMoveValidator('//;\n1,2;3', board)).toBeFalsy();
    expect(validation.playerMoveValidator('//[*][%]\n1*2%3', board)).toBeFalsy();
});

test('returns false: when numbers are not separated, or only 1 number or empty string is typed', () => {
    expect(validation.playerMoveValidator('11', board)).toBeFalsy();
    expect(validation.playerMoveValidator('', board)).toBeFalsy();
    expect(validation.playerMoveValidator('312323', board)).toBeFalsy();
    expect(validation.playerMoveValidator('1', board)).toBeFalsy();
});

test('returns false: when the numbers are out of the playing area', () => {
    expect(validation.playerMoveValidator('1 4', board)).toBeFalsy();
    expect(validation.playerMoveValidator('3 6', board)).toBeFalsy();
});

test('returns false: when the place is already taken', () => {
    let testBoard = boardChanger([11,22,13], [12,33], board);
    expect(validation.playerMoveValidator('1 1', testBoard)).toBeFalsy();
    expect(validation.playerMoveValidator('2 2', testBoard)).toBeFalsy();
    expect(validation.playerMoveValidator('3 3', testBoard)).toBeFalsy();
});

test('returns true: when typed numbers are valid', () => {
    expect(validation.playerMoveValidator('1 1', board)).toBeTruthy();
    expect(validation.playerMoveValidator('2 3', board)).toBeTruthy();
});



//WINNER VALIDATOR

test('returns false: when all fields are free', () => {
   expect(validation.winnerValidator('X', board, winnerPatterns)).toBeFalsy();
   expect(validation.winnerValidator('O', board, winnerPatterns)).toBeFalsy();
});

test('returns false: when 1 player almost wins, when every field is taken and no one wins', () => {
    let testBoard = boardChanger([11,22,13,21,32], [], board);
    expect(validation.winnerValidator('X', testBoard, winnerPatterns)).toBeFalsy();

    testBoard = boardChanger([11,22,13,21,32], [12,33,23,31], board);
    expect(validation.winnerValidator('X', testBoard, winnerPatterns)).toBeFalsy();
    expect(validation.winnerValidator('O', testBoard, winnerPatterns)).toBeFalsy();
 });

 test('returns true: when "X" has 3 in a row, when "O" has 3 in a row. When all spaces are taken and "X" has 3 in a row, returns true for "X" and false for "O"', () => {
    let testBoard = boardChanger([31,32,33], [21,12], board);
    expect(validation.winnerValidator('X', testBoard, winnerPatterns)).toBeTruthy();

    testBoard = boardChanger([11,12,33], [21,22, 23], board);
    expect(validation.winnerValidator('O', testBoard, winnerPatterns)).toBeTruthy();

    testBoard = boardChanger([11,22,21,13,31], [12,23,32,33], board);
    expect(validation.winnerValidator('X', testBoard, winnerPatterns)).toBeTruthy();
    expect(validation.winnerValidator('O', testBoard, winnerPatterns)).toBeFalsy();
 });



//TIE VALIDATOR

test('return false: when every field is empty, when there are some fields free, when all fields are taken except one', () => {
    let testBoard = boardChanger([], [], board);
    expect(validation.tieValidator(testBoard)).toBeFalsy();

    testBoard = boardChanger([11,12,13], [22,23], board);
    expect(validation.tieValidator(testBoard)).toBeFalsy();

    testBoard = boardChanger([11,22,13,21], [12,33,23,31], board);
    expect(validation.tieValidator(testBoard)).toBeFalsy();
});

test('return true: when all fields are taken', () => {
    let testBoard = boardChanger([11,22,13,21,32], [12,33,23,31], board);
    expect(validation.tieValidator(testBoard)).toBeTruthy();

    testBoard = boardChanger([12,32,33,23,31], [13,11,22,21], board);
    expect(validation.tieValidator(testBoard)).toBeTruthy();
});