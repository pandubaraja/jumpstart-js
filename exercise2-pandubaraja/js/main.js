import { getComputerChoice, playRound, Choice } from './game.js';
import { updateScore, updateMessage } from './ui.js';

// TODO: Select DOM elements
const playerScoreSpan = document.getElementById("player-score")
const computerScoreSpan = document.getElementById("computer-score")
const choiceContainer = document.getElementById("choices-container")

// TODO: Initialize game variables

// TODO: Add event listeners to choice buttons
choiceContainer.addEventListener('click', (event) => {
    event.stopPropagation()
})

// Main game logic
function game(playerChoice) {
  // TODO: Implement main game logic
}

console.log(playRound(Choice.SCISSORS, getComputerChoice()))