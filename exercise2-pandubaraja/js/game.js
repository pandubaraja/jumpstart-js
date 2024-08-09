export const Choice = Object.freeze({
    ROCK: '✊',
    PAPER: '✋',
    SCISSORS: '✌'
})

const choiceKeys = Object.keys(Choice)
const choices = Object.values(Choice)

const winnerRules = {
    [Choice.ROCK]: [Choice.SCISSORS],
    [Choice.SCISSORS]: [Choice.PAPER],
    [Choice.PAPER]: [Choice.ROCK]
}

export function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)]
}

function compareChoices(choice1, choice2) {
    if(choice1 == choice2) return 0
    if(winnerRules[choice1] == choice2) return 1
    return -1
}

export function playRound(playerChoice, computerChoice) {
    // TODO: Implement round logic
    const result = compareChoices(playerChoice, computerChoice)

    if (result == 0) {
        console.log("draw")
    } else if(result == 1) {
        console.log("win")
    } else {
        console.log("lose")
    }
}