import { validation, isNotBlank } from "./validation.js"

const Status = {
    INCOMPLETE: 'incomplete',
    COMPLETED: 'completed'
}; 

let mCurrentSelectedFilter = "all"

const mTodoList = localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : []

mTodoList.forEach((todo) => {
    const todoListView = document.getElementById('todoList')
    const todoView = createTodoView(
        todo.text,
        (target) => completeTodo(target),
        (target) => editTodo(target),
        (target) => removeTodo(target),
    )

    if (todo.status == Status.COMPLETED) {
        completeTodo(todoView, false)
    }

    todoListView.appendChild(todoView)

    filterTodo(mCurrentSelectedFilter)
})

export function setTodoFilter(filter) {
    mCurrentSelectedFilter = filter
    filterTodo(filter)
}

export function addTodo() {
    const todoInputText = document.getElementById('todoInput')
    const todoListView = document.getElementById('todoList')
    const errorWrapperView = document.getElementById('error')

    let todoValue = todoInputText.value
    const result = validation(todoValue, [isNotBlank])
    errorWrapperView.innerHTML = ''

    if (result.isValid) {
        todoInputText.classList.remove('error')
        errorWrapperView.classList.add('hidden')

        const todoView = createTodoView(
            todoValue,
            (target) => completeTodo(target),
            (target) => editTodo(target),
            (target) => removeTodo(target),
        )

        modifyTodoList((arr) => {
            arr.push({
                text: todoValue,
                status: Status.INCOMPLETE
            })
        })

        todoListView.appendChild(todoView)
        todoInputText.value = ''
        todoInputText.focus()

        filterTodo(mCurrentSelectedFilter)
    } else {
        todoInputText.classList.add('error')
        errorWrapperView.classList.remove('hidden')

        const errorListView = document.createElement('ul')

        result.errors.forEach(error => {
            const errorItem = document.createElement('li')
            errorItem.innerText = error
            errorListView.appendChild(errorItem)
        })

        errorWrapperView.appendChild(errorListView)
    }
}

export function completeTodo(target, saveToStorage = true) {
    const [completeButton, span, removeButton] = target.children

    const isCompleted = target.classList.contains(Status.COMPLETED) 

    if (saveToStorage) { 
        modifyTodoList((arr) => {
            arr[getTodoIndex(target)].status = isCompleted ? Status.INCOMPLETE : Status.COMPLETED
        })
    }

    target.classList.toggle(Status.COMPLETED)
    completeButton.classList.toggle(Status.COMPLETED)
    span.classList.toggle(Status.COMPLETED)
    removeButton.classList.toggle(Status.COMPLETED)

    filterTodo(mCurrentSelectedFilter)
}

function editTodo(target) {
    const [, span] = target.children
    const editInputText = document.createElement('input')
    editInputText.classList.add('edit-input')
    editInputText.value = span.innerText

    editInputText.addEventListener('keyup', (e) => {
        e.preventDefault()
        if (e.key == 'Enter') {
            span.innerText = editInputText.value
            target.replaceChild(span, editInputText)

            modifyTodoList((arr) => {
                arr[getTodoIndex(target)].text = editInputText.value
            })
        }
    })

    target.replaceChild(editInputText, span)
}

function removeTodo(target) {
    modifyTodoList((arr) => {
        arr.splice(getTodoIndex(target), 1)
    })

    target.remove()
}

function filterTodo(filter) {
    const todoListView = document.getElementById('todoList')
    const todoItems = todoListView.querySelectorAll('li')

    todoItems.forEach(item => {
        item.classList.remove('hidden')

        if (
            filter == Status.COMPLETED && !item.classList.contains(Status.COMPLETED) ||
            filter == Status.INCOMPLETE && item.classList.contains(Status.COMPLETED)
        ) {
            item.classList.add('hidden')
        }
    })
}

function createTodoView(
    text,
    completeCallback,
    editCallback,
    removeCallback
) {
    const todoItemView = document.createElement('li')

    const textView = document.createElement('span')
    textView.innerText = text

    const completeButton = document.createElement('button')
    completeButton.innerText = '✔'
    completeButton.classList.add('complete-button')
    
    const removeButton = document.createElement('button')
    removeButton.innerText = '✖'
    removeButton.classList.add('remove-button')

    textView.addEventListener('click', (e) => {
        e.stopPropagation() 
        editCallback(todoItemView)
    })

    completeButton.addEventListener('click', (e) => {
        e.stopPropagation()
        completeCallback(todoItemView)  
    })

    removeButton.addEventListener('click', (e) => {
        e.stopPropagation()
        removeCallback(todoItemView)  
    })

    todoItemView.appendChild(completeButton)
    todoItemView.appendChild(textView)
    todoItemView.appendChild(removeButton)

    return todoItemView
}

function getTodoIndex(target) {
    const todoListView = document.getElementById('todoList')
    return Array.from(todoListView.children).indexOf(target)
}

function modifyTodoList(operation) {
    operation(mTodoList)
    localStorage.setItem("todoList", JSON.stringify(mTodoList))
}
