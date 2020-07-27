const inquirer = require('inquirer');
const validators = require('./validation/validation');
const initialState = require('./initialState');
const computerHelpers = require('./computerHelpers/computerHelpers');

let playersArray,
    playersObject,
    gameType,
    board;

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

const resetState = () => {
    playersArray = initialState.playersArray();
    playersObject = initialState.playersObject();
    gameType = initialState.gameType();
    board = initialState.board();
};

const winnerLogic = (player) => {

    player !== false ?
    console.log(`${player} is the winner!`)
    :
    null

    return inquirer.prompt([
        {
            type: 'confirm',
            message: 'Would you like to play again?',
            name: 'playAgain',
        }
    ]).then(answers => {
        if(answers.playAgain){
            gameInit();
        }else{
            return
        };
    });
};

const showBoard = () => {
    console.log('\n' +
    '    1   2   3   \n' +
    '  ~~~~~~~~~~~~~ \n' +
    '1 | '+ board[11] +' | '+ board[21] +' | '+ board[31] +' | \n' +
    '  ~~~~~~~~~~~~~ \n' +
    '2 | '+ board[12] +' | '+ board[22] +' | '+ board[32] +' | \n' +
    '  ~~~~~~~~~~~~~ \n' +
    '3 | '+ board[13] +' | '+ board[23] +' | '+ board[33] +' | \n' +
    '  ~~~~~~~~~~~~~ \n');
};

const otherPlayer = (curentPlayer) => {
    return playersArray.filter(e => e !== curentPlayer).join('');
}

const playerVsPlayer = (player) => {
    const opponent = otherPlayer(player);
    inquirer.prompt([
            {
                type: 'input',
                message: `${player}, enter the coordinates (X => horizontal, Y => vertical)`,
                name: 'position'
            },
        ])
        .then(answers => {
            const position = answers.position.trim();
            if(position === 'resign'){
                winnerLogic(opponent);
            }else {
                if (validators.playerMoveValidator(position, board)) {
                    board[position.replace(/ /g,'')] = playersObject[player];
                    showBoard();
                    if (validators.winnerValidator(playersObject[player], board, winnerPatterns)) {
                        return winnerLogic(player);
                    }else if(validators.tieValidator(board)){
                        console.log('It is a tie!');
                        return winnerLogic(false);
                    }else {
                        playerVsPlayer(opponent);
                    };
                } else {
                    playerVsPlayer(player);
                };
            };
        });       
};

const computerLogic = () => {
    const cornerPositions = [11, 31, 13, 33];

    // Finding free positions and determining second move
    let freePositions = Object.keys(board).filter(e => board[e] !== 'O' && board[e] !== 'X');

    // Defining possible winning paterns and what move to make if attacking or defending is not available
    let [possiblePaterns, computerMove] = computerHelpers.possiblePaterns(winnerPatterns, board);

    // Checking if there is a winning move possible
    let computerAttack = computerHelpers.attackDefense(possiblePaterns, board, 'X');

    // Checking if there is a need for defense
    let defenseMove = computerHelpers.attackDefense(winnerPatterns, board, 'O');

    // Computer plays
    if(freePositions.length === 9){
        board[cornerPositions[Math.floor(Math.random() * cornerPositions.length)]] = 'X';
    }else if(computerAttack.length > 0){
        board[computerAttack[0]] = 'X';
    }else if(defenseMove.length > 0){
        board[defenseMove[0]] = 'X';
    }else if(computerMove.length > 0){
        if(freePositions.length === 7){
            board[computerHelpers.computerSecondMove(board)] = 'X';
        }else {
            board[computerMove[0]] = 'X';
        }
    }else{
        board[freePositions[0]] = 'X';
    };

    showBoard();
    if (validators.winnerValidator('X', board, winnerPatterns)) {
        return winnerLogic(playersArray[0]);
    }else if(validators.tieValidator(board)){
        console.log('It is a tie!');
        return winnerLogic(false);
    }else {
        playerComputer(playersArray[1]);
    };

};

const playerComputer = (player) => {
    const opponent = otherPlayer(player);
    if (player === playersArray[0]){
        computerLogic();
    }else {
        inquirer.prompt([
            {
                type: 'input',
                message: `${player}, enter the coordinates (X => horizontal, Y => vertical)`,
                name: 'position'
            },
        ])
        .then(answers => {
            const position = answers.position.trim();
            if(position === 'resign'){
                winnerLogic(opponent);
            }else {
                if (validators.playerMoveValidator(position, board)) {
                    board[position.replace(/ /g,'')] = playersObject[player];
                    showBoard();
                    if (validators.winnerValidator(playersObject[player], board, winnerPatterns)) {
                        return winnerLogic(player);
                    }else if(validators.tieValidator(board)){
                        console.log('It is a tie!');
                        return winnerLogic(false);
                    }else {
                        playerComputer(playersArray[0]);
                    };
                } else {
                    playerComputer(player);
                };
            };
        });  
    };

};


const gameInit = () => {
    inquirer.prompt([
        {
            type: 'list', 
            message: 'Which game do you want to play?', 
            name: 'gameType', 
            choices: ['Player VS Player', 'Players VS Computer'],
        }
    ])
    .then(answer => {
        resetState();
        gameType = answer.gameType;
        if(gameType === 'Player VS Player'){
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Player one name?',
                    name: 'playerOne'
                },
                {
                    type: 'input',
                    message: 'Player two name?',
                    name: 'playerTwo'
                }
            ]).then(answer => {
                if(answer.playerTwo === answer.playerOne){
                    answer.playerTwo = answer.playerOne + ' 2';
                }
                Object.keys(answer).map(e => playersArray.push(answer[e]));
                playersObject = {
                    [playersArray[0]]: 'X',
                    [playersArray[1]]: 'O'
                };
                console.log('The game has Started!');
                showBoard();
                playerVsPlayer(playersArray[0]);
            });
        }else {
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Your name?',
                    name: 'player'
                }
            ]).then(answer => {
                if(answer.player === 'Computer'){
                    answer.player = answer.player + ' 2';
                }
                playersArray = ['Computer', answer.player];
                playersObject = {
                    [playersArray[0]]: 'X',
                    [playersArray[1]]: 'O'
                };
                console.log('The game has Started!');
                showBoard();
                playerComputer(playersArray[0]);
            });
        };
    });
};

gameInit();