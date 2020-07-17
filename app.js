const inquirer = require('inquirer');
const validators = require('./validation');
const initialState = require('./initialState');

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

const playerVsPlayer = (player) => {

    inquirer.prompt([
            {
                type: 'input',
                message: `${player}, enter the coordinates (X => horizontal, Y => vertical)`,
                name: 'position'
            },
        ])
        .then(answers => {
            const position = answers.position.trim();
            
            // Checking if the player resigned
            if(position === 'resign'){
                const winner = playersArray.filter(e => e !== player);
                winnerLogic(winner);
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
                        if (player === playersArray[0]) {
                            playerVsPlayer(playersArray[1]);
                        } else {
                            playerVsPlayer(playersArray[0]);
                        };
                    };
                } else {
                    playerVsPlayer(player);
                };
            };
        });       
};

const computerLogic = () => {

    const cornerPositions = [11, 31, 13, 33];
    const middleSidePositions = [21, 32, 23, 12];

    // Finding free positions
    let freePositions = [];
    Object.keys(board).map(e => {
        if(board[e] !== 'O' && board[e] !== 'X'){
            return freePositions.push(e);
        };
    });

    // Finding all possible wining patterns for the computer
    let possibleComputerWinningPatterns = [];
    for(let i in winnerPatterns){
        let counter = 0;
        for(let j in winnerPatterns[i]){
            if(board[winnerPatterns[i][j]] === ' ' || board[winnerPatterns[i][j]] === 'X'){
                counter++;
            };
            if(counter === 3){
                possibleComputerWinningPatterns.push(winnerPatterns[i]); 
            };
        };
    };

    // Defining what move to make, and possibly push an array of 2 spaces already taken by X in the win pattern
    let computerMove = [];
    let computerPossibleAttack = [];
    possibleComputerWinningPatterns.map(firstEl => {
        let counter = 0;
        firstEl.map(secondEl => {
            if(board[secondEl] === 'X'){
                counter++;
            };
            if(board[secondEl] !== 'X'){
                computerMove.push(secondEl);
            };
            if(counter === 2){
                computerPossibleAttack.push(firstEl);
            };
        });
    });

    // Determining what space is free in the possible computer attack patern
    let computerAttack = [];
    computerPossibleAttack.map(firstEl => {
        firstEl.map(secondEl => {
            if(board[secondEl] === ' '){
                computerAttack.push(secondEl);
            }
        });
    });

    // Finding a possible wining pattern for the player if there are 2 O's in a row
    let possiblePlayerWinningPatterns = [];
    for(let i in winnerPatterns){
        let counter = 0;
        for(let j in winnerPatterns[i]){
            if(board[winnerPatterns[i][j]] === 'O'){
                counter++;
            }
            if(counter === 2){
                possiblePlayerWinningPatterns.push(winnerPatterns[i]);
            }
        }
    };

    // Defining what position should the computer play if there is a possible player winning patern
    let computerDefendMove = [];
    possiblePlayerWinningPatterns.map(firstEl => {
        firstEl.map(secondEl => {
            if(board[secondEl] === ' '){
                computerDefendMove.push(secondEl);
            }
        })
    });

    // Computer plays
    if(freePositions.length === 9){
        board[cornerPositions[Math.floor(Math.random() * cornerPositions.length)]] = 'X';
    }else if(computerAttack.length > 0){
        board[computerAttack[0]] = 'X';
    }else if(computerDefendMove.length > 0){
        board[computerDefendMove[0]] = 'X';
    }else if(computerMove.length > 0){

        //Making the AI completely unbeatable,
        //If you want to try to win, leave only this: board[computerMove[0]] = 'X'; in this if else statement
        if(freePositions.length === 7){
            for(var i = 0; i < computerMove.length; i++){
                let counter = 0;
                for(var j = 0; j < middleSidePositions.length; j++){
                    if(middleSidePositions[j] !== computerMove[i]){
                        counter++;
                    }
                    if(counter === 4){
                        board[computerMove[i]] = 'X';
                        break;
                    }
                }
                if(counter === 4){
                    break;
                }
            };
        }else {
            board[computerMove[0]] = 'X';
        }
    }else{
        board[freePositions[0]] = 'X';
    };
    
    // Checking winner or tie, giving the player to play
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

    // Checking if the computer should play
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

            // Checking if the player resigned
            if(position === 'resign'){
                const winner = playersArray.filter(e => e !== player);
                winnerLogic(winner);
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

                // Making an array, and object of users to know their symbol at any given time
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