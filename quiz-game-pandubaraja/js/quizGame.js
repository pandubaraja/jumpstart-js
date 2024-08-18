import { fetchQuestions } from './api.js';
import { decodeHTML } from './utils.js';

export default class GameApp {

    constructor() {
        //element
        this.quizEl = document.getElementById('quiz');
        this.panelEl = document.getElementById('panel')
        this.loadingEl = document.getElementById('loading');
        this.questionEl = document.getElementById('question');
        this.answersEl = document.getElementById('answers');
        this.startBtn = document.getElementById('start-btn');
        this.timerEl = document.getElementById('time-value');
        this.scoreEl = document.getElementById('score-value');
        this.difficultyEl = document.getElementById('difficulty-value');
        this.modeEl = document.getElementById('mode-value');

        this.mainMenuContainer = document.getElementById('main-menu')
        this.difficultyMenuContainer = document.getElementById('difficulty-menu')
        this.modeMenuContainer = document.getElementById('mode-menu')
        this.gameContainer = document.getElementById('game-container')
        this.resultContainer = document.getElementById('result-container')

        // Game state variables
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.maxTimeLeft = 30
        this.timeLeft = this.maxTimeLeft; // in seconds
        this.questions = [];
        this.difficulty = null
        this.mode = null
            
        this.init()
    }

    init = () => {
        this.startBtn.addEventListener('click', this.startButtonHandler);

        this.difficultyMenuContainer.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                this.difficultyMenuHandler(button.value)
            })
        })

        this.modeMenuContainer.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                this.modeMenuHandler(button.value)
            })
        })
    }

    difficultyMenuHandler = (difficulty) => {
        this.difficulty = difficulty
        this.difficultyEl.textContent = difficulty
        this.modeMenuContainer.classList.remove('hide-menu')
        this.difficultyMenuContainer.classList.add('hide-menu')
    }

    modeMenuHandler = (mode) => {
        this.mode = mode
        this.modeEl.textContent = mode
        this.gameContainer.classList.remove('hide-menu')
        this.modeMenuContainer.classList.add('hide-menu')

        this.startQuiz()
    }

    startButtonHandler = () => {
        this.mainMenuContainer.classList.add('hide-menu')
        this.modeMenuContainer.classList.add('hide-menu')
        this.difficultyMenuContainer.classList.remove('hide-menu')
    }

    startQuiz = async () => {
        this.score = 0;
        this.scoreEl.textContent = this.score;
        this.currentQuestion = 0;
    
        this.showLoading()

        const result = await fetchQuestions(this.difficulty);
    
        switch (result.state) {
            case "success":
                this.hideLoading()
                this.startTime = Date.now()
                this.questions = result.data
                this.showQuestion(this.questions[this.currentQuestion]);
                break;
            case "error":
                this.hideLoading()
                console.error('Error starting quiz:', result);
                this.quizEl.innerHTML = '<p>Error loading quiz. Please try again.</p>';
                break;
            default:
                break
        }
    }

    showLoading = () => {
        this.loadingEl.classList.remove('hide-menu')
        this.panelEl.classList.add('hide-menu')
        this.quizEl.classList.add('hide-menu')
    }

    hideLoading = () => {
        this.loadingEl.classList.add('hide-menu')
        this.panelEl.classList.remove('hide-menu')
        this.quizEl.classList.remove('hide-menu')
    }

    showQuestion = (data) => {
        this.startTimer()

        this.questionEl.textContent = decodeHTML(data.question)
    
        this.answersEl.innerHTML = ''
            
        data.choices.forEach(item => {
            const button = document.createElement('button');
            button.classList.add('white-btn');
            button.value = item
            button.innerHTML = decodeHTML(item)
            this.answersEl.appendChild(button)
        })
    
        const allButtons = this.answersEl.querySelectorAll('button')
        allButtons.forEach(button => {
            if (button.value === data.correctAnswer) {
                this.correctButton = button
            }
            button.addEventListener('click', () => {
                this.stopTimer()
                allButtons.forEach((button) => {
                    button.classList.remove('white-btn')
                    button.classList.add('disabled-btn')
                    button.disabled = true
                })
                this.checkAnswer(button, this.correctButton, button.value, data.correctAnswer)
            })
        })
    }

    checkAnswer = (selectedEl, correctEl, selectedAnswer, correctAnswer) => {
        if (selectedAnswer === correctAnswer) {
            selectedEl.classList.add('answer-item-correct')
            this.score += 10
            this.scoreEl.textContent = this.score
        } else {
            selectedEl.classList.add('answer-item-wrong')
            correctEl.classList.add('answer-item-correct')
        }
        
        this.currentQuestion++

        switch (this.mode) {
            case "normal":
            case "timeAttack":
                const nextButton = document.createElement('button');
                nextButton.classList.add("orange-btn")
        
                if (this.currentQuestion >= 5) {
                    nextButton.textContent = 'See Result'
                    nextButton.addEventListener('click', () => {
                        this.endQuiz()
                    })
                } else {
                    nextButton.textContent = 'Next Question'
                    nextButton.addEventListener('click', () => {
                        this.showQuestion(this.questions[this.currentQuestion]);
                    })
                }
        
                this.answersEl.appendChild(nextButton)
                break;
            case "suddenDeath":
                this.endQuiz()
                break;
        }
    }

    endQuiz = () => {
        this.gameContainer.classList.add('hide-menu')
        let resultHtml = ''

        switch (this.mode) {
            case "normal":
            case "suddenDeath":
                resultHtml = `
                    <div class="title">Game Over</div>
                    <div class="subtitle">Final Score ${this.score}</div>
                `
                break;
            case "timeAttack":
                this.timeAttackResult = ((Date.now() - this.startTime) / 1000).toFixed(2)
                resultHtml = `
                    <div class="title">Game Over</div>
                    <div class="subtitle">Final Score ${this.score}</div>
                    <div class="subtitle">Finish Time ${this.timeAttackResult}s</div>
                `
                break;
        }
        this.resultContainer.innerHTML = resultHtml

        const playAgainBtn = document.createElement('button');
        playAgainBtn.textContent = 'Play Again'
        playAgainBtn.classList.add('orange-btn')

        playAgainBtn.addEventListener('click', (e) => {
            this.gameContainer.classList.remove('hide-menu')
            this.resultContainer.innerHTML = ''
            this.resultContainer.classList.add('hide-menu')
            this.startQuiz()
        })

        const gotoMainMenuBtn = document.createElement('button');
        gotoMainMenuBtn.textContent = 'Goto Main Menu'
        gotoMainMenuBtn.classList.add('orange-btn')

        gotoMainMenuBtn.addEventListener('click', (e) => {
            this.mainMenuContainer.classList.remove('hide-menu')
            this.gameContainer.classList.add('hide-menu')
            this.resultContainer.classList.add('hide-menu')
        })

        this.resultContainer.appendChild(playAgainBtn)
        this.resultContainer.appendChild(gotoMainMenuBtn)
    }

    startTimer = () => {
        this.timeLeft = this.maxTimeLeft;
        this.timerEl.textContent = this.timeLeft;

        this.timer = setInterval(() => {
            this.timeLeft--
            this.timerEl.textContent = this.timeLeft

            if (this.timeLeft < 0) {
                clearInterval(this.timer)

                this.currentQuestion++
                if (this.currentQuestion >= 5) {
                    this.endQuiz();
                } else {
                    this.showQuestion(this.questions[this.currentQuestion]);
                }
            }
        }, 1000)
    }

    stopTimer = () => {
        clearInterval(this.timer)
    }
}