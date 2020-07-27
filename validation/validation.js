
const playerMoveValidator = (position, board) => {

    const trimedPosition = position.replace(/ /g,'');
    
    if(isNaN(trimedPosition)){
        console.log('Invalid input: this is not a number!');
        return false;
    }else if(!position.includes(' ')){
        console.log('Invalid input: you must enter the x and y coordinates separated by spaces');
        return false;
    }else if(board[trimedPosition] === undefined){
        console.log('Invalid input: those coordinates are outside the playable area');
        return false;
    }else if(board[trimedPosition] !== ' '){
        console.log('Invalid input: that space is already taken');
        return false;
    }else {
        return true;
    };

};


const winnerValidator = (symbol, board, winnerPatterns) => {
    let boolean = false;
    winnerPatterns.map(e => {
        if(e.filter(el => board[el] === symbol).length === 3){
            boolean = true;
        }
    });
    return boolean;
};

const tieValidator = (board) => {
    const tie = Object.keys(board).filter(e => board[e] === ' ');
    if(tie.length === 0){
        return true;
    }else {
        return false;
    };
};


exports.tieValidator = tieValidator;
exports.playerMoveValidator = playerMoveValidator;
exports.winnerValidator = winnerValidator;
