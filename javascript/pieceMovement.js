// globalContinuator is needed :(

let globalContinuator = true;
let castleParameters = [true, true, true, true, true, true,] // aRook, King, hRook (first 3 white ones, then black) true = has not moved

// ....

function returnLegalMoves(id, color, piece, arr) {
    // console.log(`returnLegalMoves is called with: ${id} , ${color} , ${piece}`);
    let returnLegalMovesOutput = returnTakeMoves(id, color, piece, gameArr);
    if (piece === 'P') {
        let pawnMoveMoves = returnPawnMoveMoves(id, color, arr);
        returnLegalMovesOutput.push(...pawnMoveMoves)
    }
    if (piece === 'Ki') {
        let castleMoves = returnCastleMoves(id, color, arr);
        returnLegalMovesOutput.push(...castleMoves)
    }
    // console.log('returnLegalMovesOutput: ' + returnLegalMovesOutput);

    returnLegalMovesOutput = returnLegalMovesOutput.filter(function (element) {
        return element != null;
      });

    returnLegalMovesOutput = returnFilteredForIllegalMate(returnLegalMovesOutput, id, color, piece, arr);
    return returnLegalMovesOutput
}


function returnFilteredForIllegalMate(moveSetArr, moverOriginID, moverColor, moverPiece, arr) {
    let returnFilteredForIllegalMateOutput = [];
    console.log(`returnFilteredForIllegalMate receives: (moveSetArr, moverOriginID, moverColor, moverPiece, arr*)' ${moveSetArr} ${moverOriginID} ${moverColor} ${moverPiece}`);
    for (let k=0; k<moveSetArr.length; k++) {
        let moveToCheckID = moveSetArr[k];
        console.log('moveToCheckID: ' + moveToCheckID);
        let potentialNewGameArr = [...gameArr];
        potentialNewGameArr[moveToCheckID] = potentialNewGameArr[moverOriginID];
        potentialNewGameArr[moverOriginID] = undefined;
        let observerColor = returnOppositeColor(returnColor(moverColor));
        // console.log(`the obeservercolor: ${observerColor}`);
        let observedByOpposition = returnObservedBy(observerColor, potentialNewGameArr);
        if (includesNoImmediateKingCaptures(observedByOpposition, moverColor, potentialNewGameArr)) {
            returnFilteredForIllegalMateOutput.push(moveToCheckID)
        }

    }   
    return returnFilteredForIllegalMateOutput
}



function returnTakeMoves(id, color, piece, arr) {
    // console.log(`returnTakeMoves is called with id,color,piece,arr: ${id} , ${color} , ${piece}`);

    globalContinuator = true;
    let returnTakeMovesOutput = [];
    switch(piece) {
        case 'R':
            returnTakeMovesOutput = rookMoves(id, color, arr);
            break;
        case 'K':
            returnTakeMovesOutput = knightMoves(id, color, arr);
            break;
        case 'B':
            returnTakeMovesOutput = bishopMoves(id, color, arr);
            break;
        case 'Ki':
            returnTakeMovesOutput = kingMoves(id, color, arr);
            break;
        case 'Q':
            returnTakeMovesOutput = queenMoves(id, color, arr);
            break;
        case 'P':
            returnTakeMovesOutput = pawnTakeMoves(id, color, arr);
            break;
        default:
            alert("invalid argument for piece passed into returnTakeMoves");
    }
    return returnTakeMovesOutput
}







// rook-moves

function rookMoves(originID, originColor, arr) {
    let rookMovesOutput = []; 
    let rookPattern = [1,10,-1,-10];
    for (let j=0; j<4; j++) {
        let template = rookPattern[j];
        globalContinuator = true;
        for (let i=1; i<10; i++) {
            if(globalContinuator) {
                let targetID = originID+i*template;
                rookMovesOutput.push(returnIdIfLegal(targetID, originColor, arr));
            }
        }
    }
    return rookMovesOutput
}

// knight-moves


function knightMoves(originID, originColor, arr) {
    let knightMoveOutput = [];
    let knightPattern = [-19,-8, 12, 21, 19, 8, -12, -21];
    for (let i=0; i<8; i++) {
        knightMoveOutput.push(returnIdIfLegal(originID+knightPattern[i], originColor, arr));
    }
    return knightMoveOutput
}

// bishop-moves

function bishopMoves(originID, originColor, arr) {
    let bishopMovesOutput = []
    let bishopPattern = [-9,11,9,-11]
    for (let j=0; j<4; j++) {
        let template = bishopPattern[j];
        // console.log('\n\n\n j: ' + j + ', template: ' + template);
        // console.log('------------------------------------------');
        globalContinuator = true;
        for (let i=1; i<10; i++) {
            if(globalContinuator) {
                let targetID = originID+i*template;
                bishopMovesOutput.push(returnIdIfLegal(targetID, originColor, arr));
            }
        }
    }
    return bishopMovesOutput
}

// king-moves

function kingMoves(originID, originColor, arr) {
    let kingMovesOutput = [];
    let kingPattern = [-11,-10,-9, 1, 11, 10, 9, -1, -11];
    for (let i=0; i<9; i++) {
        kingMovesOutput.push(returnIdIfLegal(originID+kingPattern[i], originColor, arr));
    }
    return kingMovesOutput
}

// queen-moves

function queenMoves(originID, originColor, arr) {
    let queenMovesOutput = [];
    queenMovesOutput = rookMoves(originID, originColor, arr);
    bishopMoves(originID, originColor, arr).forEach(element => 
        queenMovesOutput.push(element));
    return queenMovesOutput
}


function pawnTakeMoves(originID, originColor, arr) {
    // console.log(`pawnTakeMoves is called with: ${originID} ${originColor} and the arr which im not gonna print here`);
    let pawnTakeMovesOutput = [];
    switch(originColor) {
        case 'w':
            if (returnColor(arr[originID-11]) === 'b' || originID-11 === specialCaseEnPassantID) {
                pawnTakeMovesOutput.push(originID-11)
            }
            if (returnColor(arr[originID-9]) === 'b' || originID-9 === specialCaseEnPassantID) {
                pawnTakeMovesOutput.push(originID-9)
            }
            break;
        case 'b':
            if (returnColor(arr[originID+11]) === 'w' || originID+11 === specialCaseEnPassantID) {
                pawnTakeMovesOutput.push(originID+11)
            }
            if (returnColor(arr[originID+9]) === 'w' || originID+9 === specialCaseEnPassantID) {
                pawnTakeMovesOutput.push(originID+9)
            }
            break;
    }
    return pawnTakeMovesOutput
}

function returnPawnMoveMoves(originID, originColor, arr) {
    // console.log(`returnPawnMoveMoves is called with: ${originID} ${originColor} and the arr which im not gonna print here`);
    let returnPawnMoveMovesOutput = [];
    switch(originColor) {
        case 'w':
            // console.log('white');
                if (arr[originID-10] === undefined) {
                    returnPawnMoveMovesOutput.push(originID-10);
                    if (arr[originID-20] === undefined && originID < 89 && 80 < originID) {
                        returnPawnMoveMovesOutput.push(originID-20);
                    }
                }
            break;
        case 'b':
            // console.log('white');
                if (arr[originID+10] === undefined) {
                    returnPawnMoveMovesOutput.push(originID+10);
                    if (arr[originID+20] === undefined && originID < 39 && 30 < originID) {
                        returnPawnMoveMovesOutput.push(originID+20);
                    }
                }
            break;
    }
    return returnPawnMoveMovesOutput
}

function returnCastleMoves(id, color, arr) {
    returnCastleMovesOutput = [];
    console.log(`returnCastleMoves receives: ${id} ${color}`);
    if (color === 'w') {
        if (castleParameters[0] && castleParameters[1]) {
            if (fieldsAreNotAttacked([93, 94, 95], 'b', arr)) {
                if(fieldsAreEmpty([92,93,94])) {
                    returnCastleMovesOutput.push(93);
                }

            }
        }
        if (castleParameters[2] && castleParameters[1]) {
            if (fieldsAreNotAttacked([95, 96, 97], 'b', arr)) {
                if(fieldsAreEmpty([96, 97])) {
                    returnCastleMovesOutput.push(97);
                }

            }
        } 
    }
    if (color === 'b') {
        if (castleParameters[3] && castleParameters[4]) {
            if (fieldsAreNotAttacked([23, 24, 25], 'w', arr)) {
                if(fieldsAreEmpty([22,23,24])) {
                    returnCastleMovesOutput.push(23);
                }

            }
        }
        if (castleParameters[5] && castleParameters[4]) {
            if (fieldsAreNotAttacked([25, 26, 27], 'w', arr)) {
                if(fieldsAreEmpty([26, 27])) {
                    returnCastleMovesOutput.push(27);
                }

            }
        } 
    }
    console.log(`and returns: ${returnCastleMovesOutput}`);
    return returnCastleMovesOutput
}

function fieldsAreNotAttacked(targetArr, oppositionColor, arr) {
    let fieldsAreNotAttackedOutput = true;
    let observedArr = returnObservedBy(oppositionColor, gameArr);
    for (let i=0; i<targetArr.length; i++) {
        observedArr.forEach(element => {
            if (targetArr[i] === element) {
                fieldsAreNotAttackedOutput = false;
            }
        });
    }
    return fieldsAreNotAttackedOutput
}

function fieldsAreEmpty(targetArr) {
    let fieldsAreEmptyOutput = true;
    for (let i=0; i<targetArr.length; i++) {
        if (gameArr[targetArr[i]] !== undefined)  {
            fieldsAreEmptyOutput = false
        }
    }
    return fieldsAreEmptyOutput
}


// other functions



function returnIdIfLegal(targetID, originColor, arr) {
    // console.log('________returnIdIfLegal receives: targetID: ' + targetID + ', originColor: ' + originColor);
    let targetContent = arr[targetID];

    
    if (isOnField(targetID) === false) {
        globalContinuator = false;
    }
    if (isOnField(targetID)) {
        if(targetContent === undefined) {
            return targetID
        } else if (returnColor(targetContent) === originColor) {
            globalContinuator = false;
        } else {
            globalContinuator = false;
            return targetID
    }
        
    }
}
