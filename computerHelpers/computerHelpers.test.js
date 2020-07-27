const initialState = require('../initialState');
const computerHelpers = require('./computerHelpers');

//SETTING UP VARIABLES
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


//CHECKING THE LOOPER

test('should return 1 array with all elements of the nested array given to it, or empty array if given an empty', () => {
    const someArray = [[1,2,3], [4,5,6], [7,8,9]];
    expect(computerHelpers.looper(someArray)).toEqual([1,2,3,4,5,6,7,8,9]);
    expect(computerHelpers.looper([[]])).toEqual([]);
});



//CHECKING THE POSSIBLE PATTERNS AND COMPUTER MOVE

test('should return a nested array of all winning paterns, and 1 array with all of those numbers because there are no symbols on the board', () => {
    //this is what happens on the first move
    const secondExpect = computerHelpers.looper(winnerPatterns);
    expect(computerHelpers.possiblePaterns(winnerPatterns, board)).toEqual([winnerPatterns, secondExpect]);
});

test('should return 3 possible winning patterns, and 1 array of those numbers where there are no "X" symbols on the board', () => {
    let testBoard = boardChanger([11,33,31], [22, 21], board);
    const firstExpect = [[13,23,33],[11,12,13],[31,32,33]];
    expect(computerHelpers.possiblePaterns(winnerPatterns, testBoard)).toEqual([firstExpect, [13,23,12,13,32]]);
});

test('should return 2 possible winning patterns, and 1 array of those numbers where there are no "X" symbols on the board', () => {
    //there is an extra 13 position in secondExpect because both of the patterns include that position, therefore it is pushed 2 times
    let testBoard = boardChanger([12,22,23,31], [11,21,32], board);
    const firstExpect = [[13,23,33],[31,22,13]];
    expect(computerHelpers.possiblePaterns(winnerPatterns, testBoard)).toEqual([firstExpect, [13,33,13]]);
});

test('should return 2 possible winning patterns, and 1 array of those numbers where there are no "X" symbols on the board', () => {
    let testBoard = boardChanger([11,13,33], [22,31], board);
    const firstExpect = [[13, 23, 33],[11, 12, 13]];
    expect(computerHelpers.possiblePaterns(winnerPatterns, testBoard)).toEqual([firstExpect, [23,12]]);
});

test('should return 0 patterns, and an empty array', () => {
    //imitating 1 more move before a tie
    let testBoard = boardChanger([11,31,32,23], [21,22,12,33], board);
    expect(computerHelpers.possiblePaterns(winnerPatterns, testBoard)).toEqual([[],[]]);
});



//CHEKCING THE ATTACK DEFENSE FUNCTION
//For computer, function searches possible winning paterns, finds "X" 2 times in a row, returns the third position needed to win
//For player, function searches all winning paterns, finds "O" 2 times in a row, returns the third position needed to defend

test('should return an empty array', () => {
    //simulating first move, no attack or defense needed
    expect(computerHelpers.attackDefense(winnerPatterns, board, 'X')).toEqual([]);
    expect(computerHelpers.attackDefense(winnerPatterns, board, 'O')).toEqual([]);
});

test('should return 1 position for X', () => {
    let testBoard = boardChanger([11,31], [22,23], board);
    let possibleWinPaterns = [[11,21,31], [11,12,13], [31,32,33]]; //manual
    expect(computerHelpers.attackDefense(possibleWinPaterns, testBoard, 'X')).toEqual([21]);

    let [funcPossibleWinPaterns] = computerHelpers.possiblePaterns(winnerPatterns, testBoard); //using computerHelpers function with board
    expect(computerHelpers.attackDefense(funcPossibleWinPaterns, testBoard, 'X')).toEqual([21]);
});

test('should return 1 defend position', () => {
    let testBoard = boardChanger([11,31], [21,22], board);
    expect(computerHelpers.attackDefense(winnerPatterns, testBoard, 'O')).toEqual([23]);

    testBoard = boardChanger([11,31,23], [21,22,12], board);
    expect(computerHelpers.attackDefense(winnerPatterns, testBoard, 'O')).toEqual([32]);
});

test('should return 2 positions for X', () => {
    let testBoard = boardChanger([11,13,33], [22,21,31], board);
    let possibleWinPaterns = [[13,23,33], [11,12,13]]; //manual
    expect(computerHelpers.attackDefense(possibleWinPaterns, testBoard, 'X')).toEqual([23,12]);

    let [funcPossibleWinPaterns] = computerHelpers.possiblePaterns(winnerPatterns, testBoard); //using computerHelpers function with board
    expect(computerHelpers.attackDefense(funcPossibleWinPaterns, testBoard, 'X')).toEqual([23,12]);
});

test('should return no attack move and no defend move', () => {
    let testBoard = boardChanger([11,31,32,23], [21,22,12,33], board);
    let [funcPossibleWinPaterns] = computerHelpers.possiblePaterns(winnerPatterns, testBoard); //using computerHelpers function
    expect(computerHelpers.attackDefense(funcPossibleWinPaterns, testBoard, 'X')).toEqual([]);
    expect(computerHelpers.attackDefense(winnerPatterns, testBoard, 'O')).toEqual([]);
});



//TESTING THE COMPUTER SECOND MOVE

test('should return 33', () => {
    let testBoard = boardChanger([11], [22], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('33');

    testBoard = boardChanger([11], [31], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('33');

    testBoard = boardChanger([11], [13], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('33');
});

test('should return 31', () => {
    let testBoard = boardChanger([13], [21], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('31');

    testBoard = boardChanger([13], [12], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('31');

    testBoard = boardChanger([13], [33], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('31');

    testBoard = boardChanger([13], [11], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('31');

    testBoard = boardChanger([13], [32], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('31');
});

test('should return 22', () => {
    let testBoard = boardChanger([31], [13], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('22');

    testBoard = boardChanger([33], [11], board);
    expect(computerHelpers.computerSecondMove(testBoard)).toEqual('22');
});