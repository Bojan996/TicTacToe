const possiblePaterns = (winningPaterns, board) => {
    let patternArray = [];
    winningPaterns.map(e => {
        if(e.filter(el => board[el] === ' ' || board[el] === 'X').length === 3){
            patternArray.push(e);
        }
    });
    
    let moveArray = patternArray.flat().filter(e => board[e] !== 'X');

    return [patternArray, moveArray];
}

const attackDefense = (array, board, symbol) => {
    let patterns = [];
    array.map(e => {
        if(e.filter(el => board[el] === symbol).length === 2){
            patterns.push(e);
        }
    });

    let computerMove = patterns.flat().filter(e => board[e] === ' ');

    return computerMove;
}

const computerSecondMove = (currentBoard) => {
    const secondMovePatterns = [['11','33'], ['31','13'], ['33','11'], ['13','31']];
    let computerPosition = Object.keys(currentBoard).filter(e => currentBoard[e] === 'X').join();
    let secondMovePlay = secondMovePatterns.filter(e => computerPosition === e[0]);
    if(currentBoard[secondMovePlay[0][1]] === 'O'){
        return '22';
    }else{
        return secondMovePlay[0][1];
    }
}


exports.computerSecondMove = computerSecondMove;
exports.attackDefense = attackDefense;
exports.possiblePaterns = possiblePaterns;