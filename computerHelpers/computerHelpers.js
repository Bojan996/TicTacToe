const looper = (element) => {
    let array = [];
    element.map(e => {
        e.map(el => {
            array.push(el);
        });
    });
    return array;
};

const possiblePaterns = (winningPaterns, board) => {
    let patternArray = [];
    winningPaterns.map(e => {
        if(e.filter(el => board[el] === ' ' || board[el] === 'X').length === 3){
            patternArray.push(e);
        }
    });
    
    let moveArray = looper(patternArray).filter(e => board[e] !== 'X');

    return [patternArray, moveArray];
}

const attackDefense = (array, board, symbol) => {
    let patterns = [];
    array.map(e => {
        if(e.filter(el => board[el] === symbol).length === 2){
            patterns.push(e);
        }
    });

    let computerMove = looper(patterns).filter(e => board[e] === ' ');

    return computerMove;
}


exports.attackDefense = attackDefense;
exports.possiblePaterns = possiblePaterns;
exports.looper = looper;