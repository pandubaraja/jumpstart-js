let currentSelectedFilter = "all"

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', () => {
        currentSelectedFilter = radio.value
        filterTodo(radio.value)
    })
})

document.getElementById('todoInput').addEventListener('keyup', (e) => {
    e.preventDefault()
    if (e.key == 'Enter') {
        addTodo()
    }
})

function addTodo() {
    const todoInputText = document.getElementById('todoInput')
    const todoListView = document.getElementById('todoList')

    const todoValue = todoInputText.value
    const todoView = createTodoView(
        todoValue,
        (target) => completeTodo(target),
        (target) => editTodo(target),
        (target) => removeTodo(target),
    )
    todoListView.appendChild(todoView)
    todoInputText.value = ''
    todoInputText.focus()
}

function completeTodo(target) {
    const [completeButton, span, removeButton] = target.children
    target.classList.toggle("hidden")
    target.classList.toggle('completed')
    completeButton.classList.toggle('completed')
    span.classList.toggle('completed')
    removeButton.classList.toggle('completed')
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
        }
    })

    target.replaceChild(editInputText, span)
}

function removeTodo(target) {
    target.remove()
}

function filterTodo(filter) {
    const todoListView = document.getElementById('todoList')
    todoListView.querySelectorAll('li').forEach(item => {
        item.classList.remove('hidden')

        if (
            filter == 'completed' && !item.classList.contains('completed') ||
            filter == 'incomplete' && item.classList.contains('completed')
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