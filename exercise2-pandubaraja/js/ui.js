import { Outcome } from './game.js';

const playerScoreElement = document.getElementById("player-score")
const computerScoreElement = document.getElementById("computer-score")

const playerElement = document.getElementById("player-choice")
const computerElement = document.getElementById("computer-choice")
const stageElement = document.getElementById("stage")
const infoElement = document.getElementById("info")
const choicesContainer = document.getElementById("choices-container")
const buttonReset = document.getElementById("reset")

let playerAnimationEndListener = null
let computerAnimationEndListener = null

function toggleAllButtons() {
  for (const child of choicesContainer.children) {
    child.disabled = !child.disabled
  }
}

export function updateBoard(
    outCome,
    playerScore,
    playerChoice,
    computerScore,
    computerChoice,
) {
  resetStage()
  toggleAllButtons()

  playerElement.focus()

  buttonReset.disabled = false
  infoElement.classList.remove('pulsing-animated')
  infoElement.textContent = "Who's gonna win?"
  stageElement.classList.remove('hide')
  stageElement.classList.add('show')

  if (playerAnimationEndListener != null) {
    playerElement.removeEventListener('animationend', playerAnimationEndListener)
  }

  if (computerAnimationEndListener != null) {
    computerElement.removeEventListener('animationend', computerAnimationEndListener)
  }

  playerAnimationEndListener = (event) => {
    if (event.animationName == "fadeSlideInRight") {
      computerElement.textContent = computerChoice
      computerElement.classList.add('right-choose-animated')
      return
    }

    if (event.animationName == "fadeSlideOutLeft") {
      updateScore(playerScore, computerScore)
      updateMessage(outCome)
      toggleAllButtons()
    }
  }
  playerElement.addEventListener('animationend', playerAnimationEndListener)

  computerAnimationEndListener = (event) => {
    if (event.animationName == "fadeSlideInLeft") {
      playerElement.classList.add('left-fight-animated')
      computerElement.classList.add('right-fight-animated')
      return
    }
    
    if (event.animationName == "fightFromRight") {
      if (outCome == Outcome.WIN) {
        computerElement.classList.add('right-lose-animated')
      } else if (outCome == Outcome.LOSE) {
        playerElement.classList.add('left-lose-animated')
      } else {
        updateMessage(outCome)
        toggleAllButtons()
      }
    }

    if (event.animationName == "fadeSlideOutRight") {
      updateScore(playerScore, computerScore)
      updateMessage(outCome)
      toggleAllButtons()
    }
  }
  computerElement.addEventListener('animationend', computerAnimationEndListener)

  playerElement.textContent = playerChoice
  playerElement.classList.add('left-choose-animated')  
}

function updateScore(playerScore, computerScore) {
    playerScoreElement.textContent = playerScore
    computerScoreElement.textContent = computerScore
}

export function updateMessage(result) {
    const message = {
        [Outcome.WIN]: `You win!`,
        [Outcome.LOSE]: `Computer win!`,
        [Outcome.DRAW]: `It's a draw!`
    }

    infoElement.textContent = message[result]
}

export function resetUI() {
  resetStage()
  resetScore()
}

function resetStage() {
  buttonReset.disabled = true
  infoElement.classList.add('pulsing-animated')
  infoElement.textContent = "Choose"
  playerElement.textContent = ''
  playerElement.className = 'choiced'
  computerElement.className = 'choiced'
  computerElement.textContent = ''
  stageElement.classList.remove('show')
  stageElement.classList.add('hide')
  for (const child of choicesContainer.children) {
    child.disabled = false
  }
}

function resetScore() {
  playerScoreElement.textContent = 0
  computerScoreElement.textContent = 0
}