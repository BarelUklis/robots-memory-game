function dqs(z) {
    document.querySelector(z);
}

// create an array of objects
// assign id and src to each object
function createRobotsArr(numOfPairs) {
    let robotArr = [];
    for(let i = 0; i < numOfPairs; i++) {
        robotArr[i] = robotObj = {
            src: `https://robohash.org/${i}`, 
            id: i
        };
    }
    return robotArr;
}

//// hide show cards function
// anti-bag: player can press as many time's on each button but
// it will only work if the another one was pressed and only if the
// game has began
let onOff = 0; // on/off for when player start the game
let onOffForClicker = 1; // on/off for cardWasClicked function
let counterH = 0; // switch between the show/hide function
{
// hide the card_____________________
function hideCards() {
    if(onOff === 1) {
    if(counterH === 0){
        numOfPairs = (document.querySelector('#howManyCards').value) / 2;
        let robots = randomizeAndDoubleArr(numOfPairs);
        let storage = [];

        // create a storage of each card pic
        for(let i = 0; i < robots.length; i++) {
            storage[i] = document.querySelector(`#divCa${i} img`).getAttribute('src');
        }
        // create a JSON out of the storage
        let storageJ = JSON.stringify(storage);
        // store the JSON in the browser temporery memory
        sessionStorage.setItem('originalImg', storageJ);
        for(let i = 0; i < robots.length; i++) {
            document.querySelector(`#divCa${i} img`).setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1200px-HD_transparent_picture.png');
        }
        // turn off the hide function and turn on the show function
        counterH = 1;
        // turn on the cardWasClicked function
        onOffForClicker = 1;
    }
    }
}

//show cards_________________________ 
function showCards() {
    if(onOff === 1){
    if(counterH === 1) {
        numOfPairs = (document.querySelector('#howManyCards').value) / 2;
        let robots = randomizeAndDoubleArr(numOfPairs);
        // get the JSON of the cards pic
        let storageJ = sessionStorage.getItem('originalImg');
        // turn the JSON to array
        let storage = JSON.parse(storageJ);
        // set the img to each card
        for(let i = 0; i < robots.length; i++) {
            document.querySelector(`#divCa${i} img`).setAttribute('src', storage[i]);
        }
        // remove the JSON from the memory
        sessionStorage.removeItem('originalImg')
        // turn off the show function and turn on the hide function
        counterH = 0;
        // turn off the cardsWasClicked function
        onOffForClicker = 0;
    }   
    }
}
}

// take the robot arr and double it (add a pair to each robot)
// randomize all the cards
function randomizeAndDoubleArr(numOfPairs) {
    let robotArr = createRobotsArr(numOfPairs)
    robotArr = robotArr.concat(robotArr)
    let shuffleArr = robotArr.sort((a,b) => 0.5 - Math.random());
    return shuffleArr;
}

// fill the page with divs that contain the objects
function fillPage(numOfPairs) {
    // turn on the hide/show function
    onOff = 1;
    // turn off the cardsWasClicked function
    onOffForClicker = 0;
    // switch to hide card function
    counterH = 0;
    // remove from memory the JSON of the pic (because we started a new game)
    sessionStorage.removeItem('originalImg')
    numOfPairs = (document.querySelector('#howManyCards').value) / 2;
    if(numOfPairs > 100) {
        alert('max allowed cards is 200')
        numOfPairs = 0;
    }
    let robots = randomizeAndDoubleArr(numOfPairs);
    let str = '';
    // create a div with class and id, put in each div an img with src to the pic, id and value
    for(let i = 0; i < robots.length; i++) {
        str += `<div class="cards" id="divCa${i}" onclick="cardWasClicked(event)"><img src="${robots[i]['src']}" id="${robots[i]['id']}" value="0"></div>`;
    }
    document.querySelector('#playZone').innerHTML = str;
}

// the card we first click on object
let onClickCard = {
    counter: 0,
    theElementId: 'nothing',
    theElement: null,
}

// the score
let score = 0;
let scoreDisplay = document.querySelector('#showScore');;
scoreDisplay.innerHTML = score;

// reset the points
function resetPoints() {
    score = 0;
    scoreDisplay.innerHTML = 0;
}

// score++ if player choose same cards 
function cardWasClicked(event) {
if(onOffForClicker === 1) {
let clickedCard = event.target.getAttribute('id');
console.log('card ID ' + clickedCard);
//                                \/ - this means that if it has a class its a div and not a pic and I want to ignore it
if(event.target.getAttribute('class') === 'cards') {
    
} else {
if(onClickCard.counter === 0) {
    console.log(event.target);
    let storageJ = sessionStorage.getItem('originalImg');
    let storage = JSON.parse(storageJ);
    for(let i = 0; i < storage.length; i++) {
        // if the ID of the card equal to the ID of the photo add the photo to the card (this show the card you click on)
        if(clickedCard === i.toString()){
            event.target.setAttribute('src', `https://robohash.org/${i}`)    
        }
    }
    onClickCard.theElementId = clickedCard;
    onClickCard.theElement = event.target;
    onClickCard.counter = 1;
    // set the value of the clicked card to 1
    onClickCard.theElement.setAttribute('value', '1')
    console.log(onClickCard.theElement);
} else { 
    if(onClickCard.counter === 1) {
        console.log('second click');
        let storageJ = sessionStorage.getItem('originalImg');
        let storage = JSON.parse(storageJ);
        //                                                \/ - if the second card we click on has a value of 1 it ignore it (you cant click the same card twice)
        if(clickedCard === onClickCard.theElementId && event.target.getAttribute('value').toString() == 0) {
            for(let i = 0; i < storage.length; i++) {
                if(clickedCard === i.toString()){
                    event.target.setAttribute('src', `https://robohash.org/${i}`)   
                }
            }
            // set time so you can see the cards
            setTimeout(() => {
                event.target.style.visibility = 'hidden';
                onClickCard.theElement.style.visibility = 'hidden';
            }, 1000); 
            score++;
            scoreDisplay.innerHTML = score;
        } else {
            // returns the first card value to 0
            onClickCard.theElement.setAttribute('value', '0')
            for(let i = 0; i < storage.length; i++) {
                if(clickedCard === i.toString()){
                    event.target.setAttribute('src', `https://robohash.org/${i}`)
                    setTimeout(() => {
                        event.target.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1200px-HD_transparent_picture.png')
                        onClickCard.theElement.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1200px-HD_transparent_picture.png')
                    }, 1000);     
                }
            }
        }
    }
    // set the counter to 2 so you cant click more cards until the 2 cards you clickd on go back to be hidden
    onClickCard.counter = 2;
    onClickCard.theElement.setAttribute('value', '0')
    setTimeout(() => {
        onClickCard.theElement.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1200px-HD_transparent_picture.png')
        onClickCard.counter = 0;
    }, 1000);
}
}
}
}

/******************************************************* */
/* IDEAS */
// player can save name
// player can save points
// the more cards you have the higher the multiplayer
// for each time you use the show button you loos some points with multiplayer
