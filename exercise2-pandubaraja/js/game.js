export const Choice = Object.freeze({
    ROCK: '✊',
    PAPER: '✋',
    SCISSORS: '✌'
})

export const Outcome = Object.freeze({
    WIN: 'WIN',
    LOSE: 'LOSE',
    DRAW: 'DRAW'
})

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
    if(choice1 == choice2) return Outcome.DRAW
    if(winnerRules[choice1] == choice2) return Outcome.WIN
    return Outcome.LOSE
}

export function playRound(playerChoice, computerChoice) {
    return compareChoices(playerChoice, computerChoice)
}