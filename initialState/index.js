const playersArray = () => {
    return [];
};

const playersObject = () => {
    return {};
};

const gameType = () => {
    return '';
};

const board = () => {
    return {
        11: ' ',
        21: ' ',
        31: ' ',

        12: ' ',
        22: ' ',
        32: ' ',

        13: ' ',
        23: ' ',
        33: ' '
    }
};

exports.playersArray = playersArray;
exports.playersObject = playersObject;
exports.gameType = gameType;
exports.board = board;
