function createEmptyBoard() {
    document.getElementById('container').innerHTML = '';
    for (let i=21; i<99; i++) {
        if (i%10 !== 9 && i%10 !== 0) {
            let offSet = Math.floor(i/10)%2; // offsets changes color of first-square every other rank
            let newDiv = document.createElement('div')
            newDiv.className = 'square';
            newDiv.id = i;
            if ( (i+offSet)%2 === 0) {
                newDiv.className = 'square black-square'    
            } else {
                newDiv.className = 'square white-square'
            }
            newDiv.addEventListener('click', squareClicked)
            document.getElementById('container').appendChild(newDiv);
        }
    }
}

function createOverlay() {
    let allSquares = document.querySelectorAll('.square');
        for (let i=0; i<64; i++) {
            var xOffset = (i%8) * 80 + 11;
            var yOffset = Math.floor(i/8) * 80 + 11;
            var newNr = document.createElement('div');
            newNr.style.left = xOffset + 'px';
            newNr.style.top = yOffset + 'px';
            newNr.style.position = 'absolute';
            newNr.innerHTML = allSquares[i].id;
            document.getElementById('overlay-container').appendChild(newNr);
        }
}

function fillPromotionFields() {
    let whitePromContainer = document.getElementById('white-promotion-container');
    let blackPromContainer = document.getElementById('black-promotion-container');
    let pattern = ['wQ', 'wR', 'wB', 'wK', 'bQ', 'bR', 'bB', 'bK'];
    for (let i=0; i<8; i++) {
        let newImage = document.createElement('img');
        let imageString = './pieces/' + pattern[i] + '.png';
        console.log(imageString);
        newImage.src = imageString;
        newImage.id = pattern[i];
        newImage.addEventListener('click', promotionImageClicked)
        if (i < 4) {
            whitePromContainer.appendChild(newImage);
        } else {
            blackPromContainer.appendChild(newImage);
        }
    }
}

function promotionImageClicked() {
    console.log('promotionClicked');
    let chosenPiece = this.id;
    let oneAndEightRanksIds = [21,22,23,24,25,26,27,28,91,92,93,94,95,96,97,98];
    oneAndEightRanksIds.forEach(element => {
        if (returnPiece(gameArr[element]) === 'P') {
            gameArr[element] = chosenPiece;
        }
    })
    document.getElementById('white-promotion-container').style.display = 'none';
    document.getElementById('black-promotion-container').style.display = 'none';
    gameNotFreezed = true;
    refreshBoard();
}


function fillSquares() { // creates inserts pieces from the gameArr
    for (let i=21; i<99; i++) {
        if (i%10 !== 9 && i%10 !== 0) {
            var currentContent = gameArr[i];
            var currentField = document.getElementById(i);
            currentField.innerHTML = '';
            var img = document.createElement('img');
            
            if (currentContent === 'bR') {
                img.src = './pieces/bR.png';
            } else if (currentContent === 'bK') {
                img.src = './pieces/bK.png';
            } else if (currentContent === 'bB') {
                img.src = './pieces/bB.png';
            } else if (currentContent === 'bQ') {
                img.src = './pieces/bQ.png';
            } else if (currentContent === 'bKi') {
                img.src = './pieces/bKi.png';
            } else if (currentContent === 'bP') {
                img.src = './pieces/bP.png';
            } else if (currentContent === 'wR') {
                img.src = './pieces/wR.png';
            } else if (currentContent === 'wK') {
                img.src = './pieces/wK.png';
            } else if (currentContent === 'wB') {
                img.src = './pieces/wB.png';
            } else if (currentContent === 'wQ') {
                img.src = './pieces/wQ.png';
            } else if (currentContent === 'wKi') {
                img.src = './pieces/wKi.png';
            } else if (currentContent === 'wP') {
                img.src = './pieces/wP.png';
            }
            if (currentContent !== undefined) {
                currentField.appendChild(img);
            }
        }
    }
}

function colorizeLegalMoves(arr) {
    // console.log(`colorizeLegalMoves is being called  with: ${arr}`);
    arr.forEach(element => {
        if (isOnField(element)) {
                var x = document.getElementById(element);
                x.style.backgroundColor = "red";
        }
    });
}



function colorizeBlue(idToColor) {
    if (isOnField(idToColor)) {
        var x = document.getElementById(idToColor);
        x.style.backgroundColor = "blue";

    }
}