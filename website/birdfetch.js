// values defined above functions have global scope

// all bird information saved as objects
const americanGoldfinch = {
        picture:"american-goldfinch-looking-up.jpg",
        caption:"American Goldfinch"
};
const americanGoldfinch2 = {
    picture:"american-goldfinch-on-top.jpg",
    caption:"American Goldfinch"
};
const baltimoreOriole = {
    picture:"baltimore-oriole.jpg",
    caption:"Baltimore Oriole"
};
const blueJay = {
    picture:"blue-jay-on-snowy-branch.jpg",
    caption:"Blue Jay"
};
const cardinal = {
    picture:"cardinal-birdhouse.jpg",
    caption:"Cardinal"
};
const cardinal2 = {
    picture:"cardinal-leaf-close-up.jpg",
    caption:"Cardinal"
};
const cardinal3 = {
    picture:"cardinal-snow-faced.jpg",
    caption:"Cardinal"
};
const europeanGoldfinch = {
    picture:"european-goldfinch.jpg",
    caption:"European Goldfinch"
};
const parakeets = {
    picture:"parakeets-green.jpg",
    caption:"Parakeets"
};
const parrot = {
    picture:"parrot-yellow-with-nut.jpg",
    caption:"Parrot"
};
const redWingBlackbird = {
    picture:"red-wing-blackbird.jpg",
    caption:"Red-winged Blackbird"
};
const roseBreastedGrosbeak = {
    picture:"rose-breasted-grosbeak.jpg",
    caption:"Rose-breasted Grosbeak"
};
const yellowCanary = {
    picture:"yellow-canary.jpg",
    caption:"Yellow Canary"
};

// all bird objects added to an array
let birdArray = new Array();
birdArray.push(americanGoldfinch);
birdArray.push(americanGoldfinch2);
birdArray.push(baltimoreOriole);
birdArray.push(blueJay);
birdArray.push(cardinal);
birdArray.push(cardinal2);
birdArray.push(cardinal3);
birdArray.push(europeanGoldfinch);
birdArray.push(parakeets);
birdArray.push(parrot);
birdArray.push(redWingBlackbird);
birdArray.push(roseBreastedGrosbeak);
birdArray.push(yellowCanary);

// used inside other functions to get the proper photo and caption
function getBird(index) {
    // find automated way to load all pictures in folder into array
    const fetchedPicture = birdArray[index].picture;
    const fetchedCaption = birdArray[index].caption;

    document.getElementById("bird-picture").src = "bird-pictures/" + fetchedPicture;
    document.getElementById("caption").innerHTML = fetchedCaption;
}

//display the last bird before the currently viewed one
function lastBird(index) {
    if (index == 0) {
        return oldIndex;
    } else {
        index = index - 1;
        getBird(index);
        return index;
    }
}

//display the bird after the currently viewed one
function nextBird(index) {
    if (index == (birdArray.length - 1)) {
        //end of list so cannot increase
        return oldIndex;
    } else {
        index = index + 1;
        getBird(index);
        return index;
    }
}

//display a random bird that is not the same as the currently viewed one
function randomBird(oldIndex) {
    // generate a new random number and don't allow it match the last random number
    let randomNumber = Math.floor(Math.random() * birdArray.length);
    while (oldIndex == randomNumber) {
        randomNumber = Math.floor(Math.random() * birdArray.length);
    }

    //getBird changes the photo and caption
    getBird(randomNumber);

    // return the random number this function used
    return randomNumber;
}