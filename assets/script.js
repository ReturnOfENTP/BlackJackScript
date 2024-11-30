
let userWin = 0;
let userTie = 0;
let userLoss = 0;

let userHand = [];
let dealerHand = [];
let deck = [];
let gameInProgress = false; // Flag to check if the game is live
let splitHands = []; // Holds hands for split functionality

let splitInProgress = false; // Tracks if split is active
let activeHandIndex = 0; // Tracks which split hand is being played (0 or 1)

// INITIALIZE AND SHUFFLE THE DECK BABY
function getDeck() {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    const deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ value, suit });
        }
    }
    return shuffleDeck(deck); // Shuffle the deck when it's created
}

// SOMEONE SUGGESTED MFA PUT SOME SHUFFLE IN THE DECK
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements? decks? darts?
    }
    return deck;
}

// DRAW RANDOM CARD
function getCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex]; // Return the card at the random index
}

// CALCULATE TOTAL VALUE OF HAND
function calculateHand(hand) {
    let total = 0;
    let aces = 0;

    hand.forEach(card => {
        if (["J", "Q", "K"].includes(card.value)) {
            total += 10; // tres tens, this trio 10/pc 
        } else if (card.value === "A") {
            total += 11; // Aces start for the 11
            aces += 1; // your over 21 wihout it so Count the aces as 1
        } else {
            total += card.value; // Number cards are worth their face value
        }
    });

    // Adjust for aces if total exceeds 21
    while (total > 21 && aces > 0) {
        total -= 10; // Change ace from 11 to 1
        aces -= 1;
    }

    return total;
}

// DISPLAY HAND
function displayHand(hand, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous hand

    hand.forEach(card => {
        const img = document.createElement("img");

        // Check if card is face down
        if (card.value === "Face Down") {
            img.src = "assets/images/cards/face_down.jpg";  // Path to the face-down card
            img.alt = "face down card";
            img.classList.add("card-image", "face-down");
        } else {
            // Path for visible cards (using the value and suit)
            const value = card.value.toString().toLowerCase(); // Ensure the value is lowercase 
            const suit = card.suit.toLowerCase();

            img.src = `assets/images/cards/${value}_of_${suit}.jpg`; // "Yahtzel - Girls"
            img.alt = `${card.value} of ${card.suit}`;
            img.classList.add("card-image");
        }

        container.appendChild(img);
    });
}

// SEND GAME TO DOM
function updateGameResults() {
    const resultContainer = document.getElementById("game-result");
    resultContainer.textContent = `Results: Wins: ${userWin}, Ties: ${userTie}, Losses: ${userLoss}`;
}

// ENABLE/DISABLE BUTTONS
function toggleButtons(isGameInProgress) {
    // Disable or enable buttons based on game state
    document.getElementById("hit-button").disabled = !isGameInProgress;
    document.getElementById("stand-button").disabled = !isGameInProgress;
    document.getElementById("split-button").disabled = !isGameInProgress;
    document.getElementById("new-game-button").disabled = isGameInProgress;
}

// SPLIT ACTION
function split() {
    if (userHand.length !== 2 || userHand[0].value !== userHand[1].value) {
        console.log("Cannot split this hand.");
        return;
    }

    // Create two separate hands for the split
    const hand1 = [userHand[0], getCard(deck)];
    const hand2 = [userHand[1], getCard(deck)];

    splitHands = [hand1, hand2];
    splitInProgress = true;

    // Display both hands
    displayHand(hand1, "user-hand-1");
    displayHand(hand2, "user-hand-2");
    document.getElementById("user-hand").innerHTML = ""; // Clear the original hand

    // Disable split button after using it
    document.getElementById("split-button").disabled = true;

    // Calculate and log initial totals
    const total1 = calculateHand(hand1);
    const total2 = calculateHand(hand2);

    console.log(`Split completed:`);
    console.log(`Hand-1: ${hand1.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${total1})`);
    console.log(`Hand-2: ${hand2.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${total2})`);


    // Allow hitting on both hands
    document.getElementById("hit-button").disabled = false;
}

// HIT ACTION
function hit() {
    if (!gameInProgress) return; // You need to be in the game to hit

    /* Which hand is Active Fam 0,1 */ 
    const handIndex = splitInProgress && activeHandIndex < splitHands.length ? activeHandIndex : 0;
    const hand = splitInProgress ? splitHands[handIndex] : userHand; 

    /*Draw for active hand fam*/
    const newCard = getCard(deck);
    if (!newCard) return;

    hand.push(newCard);

    //UPDATE DISPLAY OF ACTIVE HAND 
    const handId = splitInProgress ? (handIndex === 0 ? "user-hand-1" : "user-hand-2") : "user-hand";
    displayHand(hand, handId);

    const userTotal = calculateHand(hand);
    console.log(`Hand-${handIndex + 1}: Drew ${newCard.value} of ${newCard.suit}`);
    console.log(`Hand-${handIndex + 1}: ${hand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${userTotal})`);


     // Check for a bust
     if (userTotal > 21) {
        console.log(`Hand-${handIndex + 1} BUSTED!`);
        userLoss++;

        if (splitInProgress && handIndex === 0) {

            // Move to the second hand if the first one busts during a split
            console.log("Switching to Hand-2...");
            activeHandIndex++;

        } else {
            // End the game for non-split games or after the second hand
            endGame("YOU BUSTED!");
            userLoss++;
        }
    }
}

// STAND ACTION
function stand() {
    if (!gameInProgress) return; // Do nothing if no game is in progress

    console.log("Weak Ass, You stand.");

    // SHOW THAT SECOND DEALER CARD
    displayHand(dealerHand, "dealer-hand"); // Show both dealer cards

    const userTotal = calculateHand(userHand);

    // DEALER: DRAW CARDS UNTIL HE HITS 17 OR MORE ADDED:(Casino rule - dealer hits on soft 17)
    while (calculateHand(dealerHand) < 17 || 
    (calculateHand(dealerHand) === 17 && dealerHand.some(card => card.value === "A"))) {
        const card = getCard(deck);
        if (!card) break;
        dealerHand.push(card);
        displayHand(dealerHand, "dealer-hand");
    }

    const dealerTotal = calculateHand(dealerHand);
    console.log(`Dealer's hand: ${dealerHand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${dealerTotal})`);

    // Check results after the dealer is done
    checkResults(userHand, dealerHand);
    endGame("Game Over!");
}

// DETERMINE OUTCOME
function checkResults(userHand, dealerHand, handLabel) {
    const userTotal = calculateHand(userHand);
    const dealerTotal = calculateHand(dealerHand);

    if (userTotal > 21) {
        console.log("YOU BUSTED!");
        userLoss++;
    } else if (dealerTotal > 21) {
        console.log("DEALER BUSTED! YOU WIN!");
        userWin++;
    } else if (userTotal > dealerTotal) {
        console.log("YOU WIN!");
        userWin++;
    } else if (userTotal < dealerTotal) {
        console.log("DEALER WINS!");
        userLoss++;
    } else {
        console.log("IT'S A TIE!");
        userTie++;
    }

    updateGameResults();
}

// DISPLAY GAME RESULTS AFTER GAME ENDS
function displayResult(resultMessage) {
    const gameResult = document.getElementById("game-result");
    gameResult.textContent = resultMessage; // Set the result message

    // Show the result container with transition
    gameResult.style.visibility = "visible";  // Make it visible
    gameResult.style.opacity = "1";           // Fade it in
}

// END GAME
function endGame(resultMessage) {
    gameInProgress = false; // End the game
    updateGameResults();  // Update the stats
    displayResult(`Wins: ${userWin} | Ties: ${userTie} | Losses: ${userLoss}`); // Show "Game Over" message with stats

    // Disable buttons or take any other end-game actions here
    toggleButtons(false); // Disable game-related buttons
}

// START NEW GAME
function startNewGame() {
    // Reset hands and deck
    deck = getDeck();
    userHand = [getCard(deck), getCard(deck)];
    dealerHand = [getCard(deck), getCard(deck)];
    splitHands = []; // Clear any split hands

    // DISPLAY CARDS + DEALER 2ND CARD FACE DOWN
    displayHand(userHand, "user-hand");

    // Set dealer hand with a face-down card for the second card
    const faceDownCard = { value: "Face Down", suit: "" };
    displayHand([dealerHand[0], faceDownCard], "dealer-hand");

    toggleButtons(true); // Enable the game buttons

    gameInProgress = true; // Set flag for game in progress
    

    // Clear result display
    const gameResult = document.getElementById("game-result");
    gameResult.style.visibility = "hidden";
    gameResult.style.opacity = "0"; // Fade out result message

    updateGameResults(); // Initialize stats
}

// BINDING BUTTONS
document.getElementById("hit-button").addEventListener("click", () => hit());
document.getElementById("stand-button").addEventListener("click", stand);
document.getElementById("split-button").addEventListener("click", split);
document.getElementById("new-game-button").addEventListener("click", startNewGame);

//YEA YOU FETCH THAT DOM 
document.addEventListener("DOMContentLoaded", function () {

    // INITIATE GAME
    startNewGame();

});
