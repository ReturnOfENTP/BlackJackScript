document.addEventListener("DOMContentLoaded", function () {

    let userWin = 0;
    let userTie = 0;
    let userLoss = 0;

    let userHand = [];
    let dealerHand = [];
    let deck = [];
    let gameInProgress = false; // Flag to check if the game is live

    // INITIALIZE THE DECK
    function getDeck() {
        const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
        const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
        const deck = [];
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ value, suit });
            }
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
                total += 10; // Face cards are worth 10
            } else if (card.value === "A") {
                total += 11; // Aces start as 11
                aces += 1; // Count the aces
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
                img.src = "images/cards/face_down.jpg";  // Path to the face-down card
                img.alt = "face down card";
                img.classList.add("card-image", "face-down");
            } else {
                // Path for visible cards (using the value and suit)
                const value = card.value.toString().toLowerCase(); // Ensure the value is lowercase 
                const suit = card.suit.toLowerCase();
                
                img.src = `images/cards/${value}_of_${suit}.jpg`;
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

    // HIT ACTION
    function hit() {
        if (!gameInProgress) return; // You need to be in the game to hit

        const newCard = getCard(deck);
        if (!newCard) return;

        userHand.push(newCard);
        displayHand(userHand, "user-hand");

        const userTotal = calculateHand(userHand);
        console.log(`Your hand: ${userHand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${userTotal})`);

        if (userTotal > 21) {
            console.log("YOU BUSTED!");
            userLoss++;
            endGame("YOU BUSTED!");
        }
    }

    // HANDLE A STAND ACTION
    function stand() {
        if (!gameInProgress) return; // Do nothing if no game is in progress

        console.log("Weak Ass, You stand.");

        // SHOW THAT SECOND DEALER CARD
        displayHand(dealerHand, "dealer-hand"); // Show both dealer cards

        const userTotal = calculateHand(userHand);

        // DEALER: DRAW CARDS UNTIL HE HITS 17 OR MORE ADDED:(Casino rule - dealer hits on soft 17)
        while (calculateHand(dealerHand) < 17 || (calculateHand(dealerHand) === 17 && dealerHand.some(card => card.value === "A"))) {
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
    function checkResults(userHand, dealerHand) {
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
        displayResult(` Wins: ${userWin} | Ties: ${userTie} | Losses: ${userLoss}`); // Show "Game Over" message with stats

        // Disable buttons or take any other end-game actions here
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
        document.getElementById("new-game-button").disabled = false;
    }

    // START NEW GAME
    function startNewGame() {
        // Reset hands and deck
        deck = getDeck();
        userHand = [getCard(deck), getCard(deck)];
        dealerHand = [getCard(deck), getCard(deck)];

        // DISPLAY CARDS + DEALER 2ND CARD FACE DOWN
        displayHand(userHand, "user-hand");

        // Set dealer hand with a face-down card for the second card
        const faceDownCard = { value: "Face Down", suit: "unknown" };
        const dealerHandWithFaceDown = [dealerHand[0], faceDownCard];

        displayHand(dealerHandWithFaceDown, "dealer-hand");

        // RESET CONSOLE LOG GAME MESSAGES
        const resultContainer = document.getElementById("game-result");
        resultContainer.textContent = "";

        // ENABLE BUTTONS (DISABLED)
        document.getElementById("hit-button").disabled = false;
        document.getElementById("stand-button").disabled = false;
        document.getElementById("new-game-button").disabled = true;

        // SET GAME IN PROGRESS
        gameInProgress = true;

        console.log(`Your hand: ${userHand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${calculateHand(userHand)})`);
        console.log(`Dealer's hand: ${dealerHand[0].value} of ${dealerHand[0].suit}, ?`);
    }

    // EVENT LISTENERS FOR BUTTONS
    document.getElementById("hit-button").addEventListener("click", hit);
    document.getElementById("stand-button").addEventListener("click", stand);
    document.getElementById("new-game-button").addEventListener("click", startNewGame);

    // START THE GAME
    startNewGame();

});