let userWin = 0;
let userTie = 0;
let userLoss = 0;


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

function getCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
}

function calculateHand(hand) {
    let total = 0;
    let aces = 0;

    hand.forEach(card => {
        if (["J", "Q", "K"].includes(card.value)) {
            total += 10;
        } else if (card.value === "A") {
            total += 11;
            aces += 1;
        } else {
            total += card.value;
        }
});

while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
}

return total;
}

function checkResults(userHand, dealerHand) {
    const userTotal = calculateHand(userHand);
    const dealerTotal = calculateHand(dealerHand);
    
    if (userTotal === 21 && userHand.length === 2) {
        console.log("WELL FUCK ME, 21");
        userWin++;
    } else if (userTotal > 21) {
        console.log("POOR EFFORT! ITS A BUST, LOOSER!");
        userLoss++;
    } else if (dealerTotal > 21) {
        console.log("DEALER BUST! YOU WIN BIG STEPA!");
        userWin++;
    } else if (userTotal > dealerTotal) {
        console.log("BIG WINNER!");
        userWin++;
    } else if (userTotal < dealerTotal) {
        console.log("DO BETTER! DEALER BEAT YO ASS, LOOSER!");
        userLoss++;
    } else {
        console.log("It's a tie lil'Bitch!");
        userTie++;
    }
}

function userEntry(deck) {
    const userHand = [getCard(deck), getCard(deck)];  
    console.log(`Your hand: ${userHand.map(card => `${card.value} of ${card.suit}`).join(".")} (Total: ${calculateHand(userHand)})`);
    displayHand(userHand,"user-hand");
    return userHand;
}

function displayHand(hand,containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; //Clear Previous Hand
    
    hand.forEach(card => {
        const img = document.createElement("img");
        img.src = `images/cards/${card.value}_of_${card.suit.toLowerCase()}.jpg`;
        img.alt = `${card.value} of ${card.suit}`;
        img.classList.add("card-image"); //CSS Class for Style 
        container.appendChild(img);

    });
}

function dealerEntry(deck) {
    const dealerHand = [getCard(deck), getCard(deck)];  
    console.log(`Dealer's hand: ${dealerHand[0].value} of ${dealerHand[0].suit}, ?`);
    displayHand(dealerHand, "dealer-hand");
    return dealerHand;
}

function runGame() {
    const deck = getDeck();
    const userHand = userEntry(deck);
    let dealerHand = dealerEntry(deck);


    let userAction = prompt("Do you want to 'hit' or 'stand'?").toLowerCase();
    while (userAction === "hit" && calculateHand(userHand) < 21) {
        userHand.push(getCard(deck));
        displayHand(userHand, "user-hand"); //New Cards Updates
        console.log(`Your hand: ${userHand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${calculateHand(userHand)})`);
        if (calculateHand(userHand) >= 21) {
            break;
        }
        userAction = prompt("Do you want to 'hit' or 'stand'?").toLowerCase();
    }

    // DEALER: HIT BELOW 17
    while (calculateHand(dealerHand) < 17) {
        dealerHand.push(getCard(deck));
    }

    console.log(`Dealer's final hand: ${dealerHand.map(card => `${card.value} of ${card.suit}`).join(", ")} (Total: ${calculateHand(dealerHand)})`);
    displayHand(dealerHand, "dealer-hand"); //Shows Dealer Final Cards/Final Hand
    checkResults(userHand, dealerHand);
}

runGame(); 