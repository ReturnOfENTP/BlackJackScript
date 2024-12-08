
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

let playerBalance = 1000; // `justHowDeep` NEED NODE.JS FOR $ DEPOSIT  
let wager = 0; // `doesTheRabbitHoleGo`
let accumulatedWager = 0; // This will hold the current accumulated wager



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
    document.getElementById("play-button").disabled = isGameInProgress;
    
}

// SPLIT ACTION
function split() {
    if (userHand.length !== 2 || userHand[0].value !== userHand[1].value) {
        console.log("Cannot split this hand.");
        return;
    }
    if (playerBalance < wager) {
        console.log("Not enough coin to split my boy");
        return;
    }
    //`Another Day` === `Another Wager`
    playerBalance -= wager; 
    console.log(`Split wager placed, Remaining Balance: $${playerBalance}`)

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

//``You Don't have to be afraid or brave just Take a HIT your safe`` --
function hit() {
    if (!gameInProgress) return; // Game must be active to hit

    const handIndex = splitInProgress ? activeHandIndex : 0; // Identify the active hand
    const hand = splitInProgress ? splitHands[handIndex] : userHand; // Determine which hand to update

    const newCard = getCard(deck);
    if (!newCard) return;

    hand.push(newCard);

    // Display the correct hand
    const handId = splitInProgress
        ? (handIndex === 0 ? "user-hand-1" : "user-hand-2")
        : "user-hand";
    displayHand(hand, handId);

    const userTotal = calculateHand(hand);
    console.log(`Your hand: ${hand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${userTotal})`);

    // Check for a bust
    if (userTotal > 21) {
        console.log(`Hand-${handIndex + 1} BUSTED!`);
        userLoss++;

        if (splitInProgress && handIndex === 0) {
            // Move to the second hand if the first one busts during a split
            console.log("Switching to Hand-2...");
            activeHandIndex++;
        } else {
            //The Only Risk is -->
            if (splitInProgress) {
                console.log("Both split hands completed.");
            }
            endGame("You busted!");
        }
    }
}

// STAND ACTION
function stand() {
    if (!gameInProgress) return; // Do nothing if no game is in progress

    console.log(`Hand-${activeHandIndex + 1} stands.`);

    // If splitting, check if there's another hand to play
    if (splitInProgress && activeHandIndex < splitHands.length - 1) {
        console.log("Switching to Hand-2...");
        activeHandIndex++; // Move to the second hand
        return; // Allow the user to play the second hand
    }

    // Otherwise --> SHOW THAT SECOND DEALER CARD  ``the only risk...go go go go insane``
    displayHand(dealerHand, "dealer-hand"); // Show both dealer cards


    // DEALER: DRAW CARDS UNTIL HE HITS 17 OR MORE ADDED:(Casino rule - dealer hits on soft 17)
    while (
    calculateHand(dealerHand) < 17 || 
    (calculateHand(dealerHand) === 17 && dealerHand.some(card => card.value === "A"))
) {
    /*``the only risk is that you go insane`` -- */
        const card = getCard(deck);
        if (!card) break;
        dealerHand.push(card);
        displayHand(dealerHand, "dealer-hand");
    }

    const dealerTotal = calculateHand(dealerHand);
    console.log(`Dealer's hand: ${dealerHand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${dealerTotal})`);

    // Check results after the dealer is done
    if (splitInProgress) {
        splitHands.forEach((hand, index) => {
            console.log(`Checking results for Hand-${index + 1}...`);
            checkResults(hand, dealerHand, `Hand-${index + 1}`);
        });
    } else {
        //``The Game we play these days - but you know your safe`` -- //
        checkResults(userHand, dealerHand, "Your Hand");
    }
    //``atleast your safe but the risk playing it safe?`` -- //
    endGame("Game Over!");
}

// DETERMINE OUTCOME 
function checkResults(userHand, dealerHand, handLabel) {
    const userTotal = calculateHand(userHand);
    const dealerTotal = calculateHand(dealerHand);

    let payout = 0;

        // Check if the user has Blackjack (first two cards totaling 21)
        const isBlackjack = userHand.length === 2 && userTotal === 21;

    if (userTotal > 21) {
        console.log(`${handLabel} YOU BUSTED! DEALER WINS`);
        userLoss++;
    } else if (dealerTotal > 21) {
        console.log(`${handLabel} WINS! DEALER BUST.`);
        userWin++;
        payout = 2; /* 2X PAYOUT FOR REGO WIN*/
    } else if (userTotal > dealerTotal) {
        console.log(`${handLabel} YOU WIN!`);
        userWin++;
        payout = 2; /*2X PAYOUT FOR REGO WIN*/
    } else if (userTotal < dealerTotal) {
        console.log(`${handLabel} LOSES!`);
        userLoss++;
    } else {
        console.log(`${handLabel} TIES WITH DEALER!`);
        userTie++;
    }

    if (isBlackjack) {
        console.log(`${handLabel} BLACKJACK BITCH! YOU WIN 3:2`);
        userWin++;
        payout = 3 / 2; //3:2 PAYOUT FOR A BLACKJACK
    }

    if (payout > 0) {
        const winAmount = wager * payout;
        playerBalance += winAmount;
        console.log(`${handLabel} Payout: $${winAmount}. Updated Balance: $${playerBalance}`);
    }

    //``going insane``
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

    splitInProgress = false;  // Ensure no split state is carried over
    accumulatedWager = 0; //RESET WAGER AFTER GAME ENDS

    // Disable buttons or take any other end-game actions here
    toggleButtons(false); // Disable game-related buttons

    document.getElementById("play-button").disabled = false;
    validWager = false; // RESET VALID WAGER

    //Reset Wager After a Game 
    console.log(`Game OVer my Dude! $${playerBalance}`);
}

// SET WAGER ------- THE ONLY RISK...
function setWager(amount) {
    if (amount <= 0 || amount + accumulatedWager > playerBalance) {
        console.log("Invalid wager amount.");
        return false;
    }
    accumulatedWager += amount; // Add the wager to the accumulated wager
    console.log(`Wager accumulated to $${accumulatedWager}. Remaining balance: $${playerBalance - accumulatedWager}`);
    updateStats(); // Update stats after every wager
    
    //Enable PLAY BUTTON AFTER WAGER PLACED
    togglePlayButton(true);
    return true;
}

//DISPLAY UPDATED STATS 
function updateStats() {
    const statsContainer = document.getElementById("player-stats");
    statsContainer.textContent = `Balance: $${playerBalance - accumulatedWager} | Current Wager: $${accumulatedWager}`;
}

// START NEW GAME
// START NEW GAME
function startNewGame() {
    // Reset hands and deck
    if (accumulatedWager <= 0) {
        console.log("Place a wager to start the game.");
        return;
    }

    playerBalance -= accumulatedWager; // Deduct the accumulated wager from the player's balance
    wager = accumulatedWager; // Set the wager to the accumulated wager
    accumulatedWager = 0; // Reset the accumulated wager after starting the game

    console.log(`Wager set to $${wager}. Remaining balance: $${playerBalance}`);

    deck = getDeck();
    userHand = [getCard(deck), getCard(deck)];
    dealerHand = [getCard(deck), getCard(deck)];
    splitHands = []; // Clear any split hands
    
    // "Welcome Back Neo"
    // Clear any previous split hand displays if any
    document.getElementById("user-hand-1").innerHTML = "";
    document.getElementById("user-hand-2").innerHTML = "";
 
    // DISPLAY CARDS + DEALER 2ND CARD FACE DOWN
    displayHand(userHand, "user-hand");

    // Set dealer hand with a face-down card for the second card
    const faceDownCard = { value: "Face Down", suit: "" };
    displayHand([dealerHand[0], faceDownCard], "dealer-hand");

    // RESET SPLIT
    splitInProgress = false; // Reset split progress state
    activeHandIndex = 0;     // Reset the active hand index

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
document.getElementById("play-button").addEventListener("click", function () {
    if (accumulatedWager <= 0) {
        console.log("Please place a wager to start the game.");
        return; // Prevent game start if no wager is placed
    }

    
    startNewGame(); // Start the game after valid wager is placed
});

//BET TO LIVE BET TO FEEL
document.getElementById("bet-game-button").addEventListener("click", function () {
    const wagerInput = document.getElementById("wager-input"); // Get the input field
    const wagerAmount = Number(wagerInput.value); // Get the wager amount from the input

    if (wagerAmount > 0 && wagerAmount <= playerBalance) {
        if (setWager(wagerAmount)) {
            wagerInput.value = ""; // Clear input after placing the bet
        }
    } else {
        alert("Invalid wager amount. Please enter a valid number.");
    }
});

// Enable/Disable the "Play" button based on whether a bet is placed
function togglePlayButton(enable) {
    document.getElementById("play-button").disabled = !enable; // Enable the play button if valid wager placed
}

//YEA YOU FETCH THAT DOM 
document.addEventListener("DOMContentLoaded", function () {

    // Set up the game interface without starting the game
    toggleButtons(false); // Disable game buttons
    togglePlayButton(false);
    updateGameResults(); // Initialize scoreboard
    document.getElementById("game-result").style.visibility = "hidden";


    // INITIATE GAME
    startNewGame();
    

});

// Open Modal
function openModal() {
    document.getElementById('login-modal').style.display = 'flex';
  }
  
  // Get the modal elements
const modal = document.getElementById("login-modal");
const closeButton = document.querySelector(".close-button");
const loginButton = document.getElementById("login-button");

// Show the modal
function openModal() {
  modal.classList.add("show");
}

// Close the modal
function closeModal() {
  modal.classList.remove("show");
}

// Open the modal when the "Login" button is clicked
loginButton.addEventListener("click", openModal);

// Close the modal when the close button (X) is clicked
closeButton.addEventListener("click", closeModal);

// Optionally, close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});


const slideToggle = document.getElementById("slide-toggle");
const slidingMain = document.getElementById("sliding-main-container");

slideToggle.addEventListener("click", () => {
    slidingMain.classList.toggle("open");




});