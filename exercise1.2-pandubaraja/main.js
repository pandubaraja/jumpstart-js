import { addTodo, setTodoFilter } from "./todo.js"

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', () => {
        setTodoFilter(radio.value)
    })
})

document.getElementById('todoInput').addEventListener('keyup', (e) => {
    e.preventDefault()
    if (e.key == 'Enter') {
        addTodo()
    }
})

document.getElementById('todoButton').addEventListener('click', (e) => {
    e.preventDefault()
    addTodo()
})

