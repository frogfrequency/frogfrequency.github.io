// variables
let testArrOne = [
    ,,,,,,,,,,,,,,,,,,
    ,,,         'bR',,,,'bKi',,,'bR'
    ,,,         ,'bP','bB',,'bQ',,'bP','bP'     
    ,,,         ,,,,,,,'bB'     
    ,,,         'bQ',,,'wB',,,,'bP'
    ,,,         ,,,,'wKi','wP','wB',
    ,,,         ,,'bP',,,,'wP','bKi'
    ,,,         'wP','wP','wQ','wP','wP',,'wQ','wP'
    ,,,         'wR',,,,'wKi',,,'wR'
    ,,,,,,,,,,,,,,,,,,,,,,       
];


let castleTestArr = [
    ,,,,,,,,,,,,,,,,,,
    ,,,         'bR',,,,'bKi',,,'bR'
    ,,,         ,,,,,,,     
    ,,,         'bB',,,,,,,     
    ,,,         ,,,,,,,
    ,,,         ,,,,,,,
    ,,,         ,,,,,,,
    ,,,         'wP',,,,'wP','wP','wP','wP'
    ,,,         'wR',,,,'wKi',,,'wR'
    ,,,,,,,,,,,,,,,,,,,,,,
];


let normalTestArr = [
    ,,,,,,,,,,,,,,,,,,
    ,,,         'bR','bK','bB','bQ','bKi','bB','bK','bR'
    ,,,         'bP','bP','bP','bP','bP','bP','bP','bP'     
    ,,,         ,,,,,,,     
    ,,,         ,,,,,,,
    ,,,         ,,,,,,,
    ,,,         ,,,,,,,
    ,,,         'wP','wP','wP','wP','wP','wP','wP','wP'
    ,,,         'wR','wK','wB','wQ','wKi','wB','wK','wR'
    ,,,,,,,,,,,,,,,,,,,,,,
];

let gameNotFreezed = true;

let specialCaseEnPassantID = 0;


let legalMovesFor = []
let legalMoveIDs = [];
let halfMoveCounter = 0;

let observedByWhite = []; // watch out for pawns which only observe diagonal
let observedByBlack = [];

let gameArr = normalTestArr;

// logic

function initialize() {
    createEmptyBoard();
    createOverlay();
    fillPromotionFields();
    fillSquares();
}



function squareClicked() {
    if (gameNotFreezed) {
        const clickedFieldID = parseInt(this.id);
        const fieldContent = gameArr[clickedFieldID];
        const clickedColor = returnColor(fieldContent);
        const clickedPiece = returnPiece(fieldContent);
            console.log(`
                clickedFieldID: ${clickedFieldID}
                fieldContent: ${fieldContent}
                clickedColor: ${clickedColor}
                clickedPiece: ${clickedPiece}
                
                legalMovesFor: ${legalMovesFor} 
                legalMoveIDs: ${legalMoveIDs}

                `);
    
        
        if (clickedIsValidMove(clickedFieldID)) {
            // console.log(`the clicked one is a valid move`);
            makeMove(clickedFieldID, legalMovesFor);
            resetLegalMoves();
        } else if (colorToMove() === clickedColor) {
            resetLegalMoves();
            refreshBoard();
            // console.log(`now is the clicked colors turn yes`);
            legalMovesFor = clickedFieldID;
            legalMoveIDs = returnLegalMoves(clickedFieldID, clickedColor, clickedPiece, gameArr);
            colorizeLegalMoves(legalMoveIDs);
        }
    }
};


function makeMove(cID, movesFor) { 
    let potentialNewGameArr = [...gameArr];
    potentialNewGameArr[cID] = potentialNewGameArr[movesFor];
    potentialNewGameArr[movesFor] = undefined;
    let moverColor = returnColor(potentialNewGameArr[cID]);
    let observerColor = returnOppositeColor(returnColor(moverColor));
    // console.log(`the observerColor is: ${observerColor}`);
    let observedByOpposition = returnObservedBy(observerColor, potentialNewGameArr);
    if (includesNoImmediateKingCaptures(observedByOpposition, moverColor, potentialNewGameArr)) {
        specialCaseEnPassantID = returnEnPassantID(cID, movesFor, moverColor, potentialNewGameArr);
        performCastleIfNeeded(cID, movesFor, potentialNewGameArr);
        updateCastleParameters(movesFor);
        gameArr = [...potentialNewGameArr];
        performPromotionIfNeeded(cID, potentialNewGameArr);
        refreshBoard();
        colorizeBlue(specialCaseEnPassantID);
        halfMoveCounter++;
    }

}


function performCastleIfNeeded(cID, movesFor, potentialNewGameArr) {
    if (returnPiece(potentialNewGameArr[cID]) === 'Ki') {
        if (Math.abs(movesFor-cID) === 2) {
            switch(cID) {
                case 93:
                    potentialNewGameArr[94] = 'wR';
                    potentialNewGameArr[91] = undefined;
                    break;
                case 97:
                    potentialNewGameArr[96] = 'wR';
                    potentialNewGameArr[98] = undefined;
                    break;
                case 23:
                    potentialNewGameArr[24] = 'bR';
                    potentialNewGameArr[21] = undefined;
                    break;
                case 27:
                    potentialNewGameArr[26] = 'bR';
                    potentialNewGameArr[28] = undefined;
                    break;
            }
        }
    }
}

function performPromotionIfNeeded(cID, potentialNewGameArr) {
    if (returnPiece(potentialNewGameArr[cID]) === 'P') {
        if (20 < cID && cID < 29) {
            showPromotionField(cID, potentialNewGameArr);
        }
        if (90 < cID && cID < 99) {
            showPromotionField(cID, potentialNewGameArr);
        }
    }
}

function showPromotionField(id, arr) {
    gameNotFreezed = false;
    let color = returnColor(arr[id])
    if (color === 'w') {
        document.getElementById('white-promotion-container').style.display = 'inline-block';
    }
    if (color === 'b') {
        document.getElementById('black-promotion-container').style.display = 'inline-block';
    }
}


////////// observedBy ...

function returnObservedBy(observerColor, arr) {
    // console.log(`returnObservedBy is called with color: ${observerColor} and the arr.....`);
    let observedByOutput = [];

    for (let i=21; i<99; i++) {
        let currentFieldContent = arr[i];
        let currentFieldColor = returnColor(currentFieldContent);
        let currentFieldPiece = returnPiece(currentFieldContent);
        if (currentFieldContent !== undefined && currentFieldColor === observerColor) {
                let innerOutput = returnTakeMoves(i, currentFieldColor, currentFieldPiece, arr);
                if (innerOutput !== undefined) {
                    observedByOutput.push(...innerOutput)
                }
        } 
        // console.log('the observedByOutput Total CURRENTLY is at: ' + observedByOutput);
    }
    // console.log('the observedByOutput Total is: ' + observedByOutput);
    return observedByOutput
}


function includesNoImmediateKingCaptures(observed, moverColor, arr) {
    let includesNoImmediateKingCapturesOutput = true;
    // console.log(`includesNoImmediateKingCaptures receives: ${observed}      moverColor:  ${moverColor}`);
    let wantedKingString = moverColor.concat('Ki');
    observed.forEach(element => {
        if (arr[element] === wantedKingString) {
            // console.log(`there is a king collision detected ! classic shit`);
            includesNoImmediateKingCapturesOutput = false;
            refreshBoard();
        }
    });
    // console.log(`there is NOOOO king collision detected !`);
    return includesNoImmediateKingCapturesOutput
}


function returnEnPassantID(cID, movesFor, moverColor, arr) {
    console.log(`returnEnPassantID receives: ${cID} ${movesFor} ${moverColor} ${arr}`);
    returnEnpassantIDOutput = 0;
    if (returnPiece(arr[cID]) === 'P') {
        if (moverColor === 'w')  {
            if (cID+20 === movesFor) {
                returnEnpassantIDOutput = movesFor-10;
            }
        } else if (moverColor === 'b') {
            if (cID-20 === movesFor) {
                returnEnpassantIDOutput = movesFor+10;
            }
        }
    }

    return returnEnpassantIDOutput
}

function updateCastleParameters(id) {
    switch(id) {
        case 21:
            castleParameters[0] = true;
            break;
        case 25:
            castleParameters[1] = true;
            break;
        case 28:
            castleParameters[2] = true;
            break;
        case 91:
            castleParameters[3] = true;
            break;
        case 95:
            castleParameters[4] = true;
            break;
        case 98:
            castleParameters[5] = true;
            break;
        default:
            break;
    }
}




/////// subsidiary functions

function colorToMove(){
    let remainder = halfMoveCounter%2;
    if (remainder === 0) {
        return 'w'
    } else if (remainder === 1) {
        return 'b'
    }
}

function returnColor(content) {
        if (content === undefined){
            return;
        } else {
        return content.charAt(0);
        }
}

function returnOppositeColor(color) {
    if (color === 'w') {
        return 'b'
    } else if (color === 'b') {
        return 'w'
    } else {
        console.log('something went wrong in the returnOppositeColorFunction');
    }
    
}


function returnPiece(content) {
    if (content === undefined){
        return;
    } else {
    return content.substring(1);
    }
}

function clickedIsValidMove(id) {
    for (let i=0; i<legalMoveIDs.length; i++) {
        if (id === legalMoveIDs[i]) {
            return true
        }   
    }
    return false
}

function resetLegalMoves() {
    legalMovesFor = []
    legalMoveIDs = [];
}

function refreshBoard() {
    createEmptyBoard();
    fillSquares();
}

function isOnField(id) {
    if (20 < id && id < 99) {
        if (id%10 !== 9 && id%10 !== 0) {
            return true;
        } else {
            return false
        }
    }
}




//////////////////////// testfunction


document.getElementById('test-function-button').addEventListener('click', testFunction);

function testFunction() {
    console.log('the TEEEEEEEEEST RETURNS: ' + fieldsAreNotAttacked([91,92,93,44,41], 'b', gameArr));
};

document.getElementById('test-function-button2').addEventListener('click', testFunction2);

function testFunction2() {
    console.log(returnPiece(gameArr[95]));
};

document.getElementById('refresh-button').addEventListener('click', refreshBoard);

document.getElementById('logGameArr-button').addEventListener('click', logGameArr);

function logGameArr() {
    for(let i=0; i<99; i++) {
        // if (isOnField(i)) {
            console.log(i + ': ' + gameArr[i]);
        // }
    }
};
