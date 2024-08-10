import { getComputerChoice, playRound, Choice, Outcome } from './game.js';
import { resetUI, updateBoard } from './ui.js';

let playerScore = 0
let computerScore = 0

document.getElementById("choices-container").addEventListener('click', (event) => {
  event.stopPropagation()

  if (!event.target.matches('button.choice')) return
  
  const userChoice = Choice[event.target.dataset.choice.toUpperCase()]
  game(userChoice)
})

document.getElementById("reset").addEventListener('click', (event) => {
  event.preventDefault()
  resetGame()
})

function game(playerChoice) {
  const computerChoice = getComputerChoice()
  const outCome = playRound(playerChoice, computerChoice)

  switch (outCome) {
    case Outcome.WIN:
      playerScore++;
      break;
    case Outcome.LOSE:
      computerScore++;
      break;
    default: break;
  }
  
  updateBoard(
    outCome,
    playerScore,
    playerChoice,
    computerScore,
    computerChoice
  )
}

function resetGame() {
  playerScore = 0
  computerScore = 0

  resetUI()
}
