let userWin = 0;
let userTie = 0;
let userLoss = 0;

function getCard() {
    // Cards are typically valued between 2 and 11, with face cards being 10 and Ace as 11
    const cardValue = Math.floor(Math.random() * 11) + 1;
    return cardValue;
}

function calculateHand(hand) {
    return hand.reduce((total, card) => total + card, 0);
}

function checkResults(userHand, dealerHand) {
    const userTotal = calculateHand(userHand);
    const dealerTotal = calculateHand(dealerHand);
    
    if (userTotal > 21) {
        console.log("DO BETTER! You exceeded 21, Looser!");
        userLoss++;
    } else if (dealerTotal > 21) {
        console.log("Dealer busts! WINNER WINNER!");
        userWin++;
    } else if (userTotal > dealerTotal) {
        console.log("WINNER!");
        userWin++;
    } else if (userTotal < dealerTotal) {
        console.log("DO BETTER! You exceeded 21, LOOSER!");
        userLoss++;
    } else {
        console.log("It's a tie Bitch!");
        userTie++;
    }
}

function userEntry() {
    let userHand = [];
    userHand.push(getCard(), getCard());  
    console.log(`Your hand: ${userHand.join(", ")} (Total: ${calculateHand(userHand)})`);
    return userHand;
}

function dealerEntry() {
    let dealerHand = [];
    dealerHand.push(getCard(), getCard());  
    console.log(`Dealer's hand: ${dealerHand[0]}, ?`);
    return dealerHand;
}

function runGame() {
    const userHand = userEntry();
    let dealerHand = dealerEntry();

    // USER: HIT OR STAND
    let userAction = prompt("Do you want to 'hit' or 'stand'?").toLowerCase();
    while (userAction === "hit" && calculateHand(userHand) < 21) {
        userHand.push(getCard());
        console.log(`Your hand: ${userHand.join(", ")} (Total: ${calculateHand(userHand)})`);
        if (calculateHand(userHand) >= 21) {
            break;
        }
        userAction = prompt("Do you want to 'hit' or 'stand'?").toLowerCase();
    }

    // DEALER: HIT BELOW 17
    while (calculateHand(dealerHand) < 17) {
        dealerHand.push(getCard());
    }

    console.log(`Dealer's final hand: ${dealerHand.join(", ")} (Total: ${calculateHand(dealerHand)})`);
    checkResults(userHand, dealerHand);
}