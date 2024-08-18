
import { shuffleArray } from './utils.js';

class Question {
    constructor(data) {
        this.category = data.category
        this.question = data.question
        this.correctAnswer = data.correct_answer

        const allAnswers = data.incorrect_answers
        allAnswers.push(this.correctAnswer)
        // shuffleArray(allAnswers)

        this.choices = allAnswers
    }
}

export async function fetchQuestions(difficulty) {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`)

        if (!response.ok) {
            return {'state': 'error', code: response.status, message: response.statusText }
        }
    
        const data = await response.json()
        const result = data.results.map(data => new Question(data))
        
        return { 'state': 'success', data: result }
    } catch (error) {
        return {'state': 'error', code: error.code, message: error.message }
    }
}