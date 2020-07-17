
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


const winnerValidator = (playerSymbol, board, winnerPatterns) => {

    for(let i in winnerPatterns){
        let counter = 0;
        for(let j in winnerPatterns[i]){
            if(board[winnerPatterns[i][j]] === playerSymbol){
                counter++;
            };
            if(counter === 3){
                return true;
            };
        };
    };
    return false;

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
