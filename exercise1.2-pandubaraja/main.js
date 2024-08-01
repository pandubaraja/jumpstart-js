const todoList = []

function addTodo() {
    const todoInputText = document.getElementById('todoInput')
    const todoListView = document.getElementById('todoList')

    const todoValue = todoInputText.value
    const todoItem = createTodoItem(
        todoValue,
        (target) => completeTodo(target),
        (target) => removeTodo(target),
    )
    todoList.push(todoValue)
    todoListView.append(todoItem)

    todoInputText.value = ''
}

function completeTodo(target) {
    target.classList.add('completed')
}

function removeTodo(target) {
    target.remove()
}

function createTodoItem(text, completeCallback, removeCallback) {
    const todoItemView = document.createElement('li')
    todoItemView.textContent = text
    todoItemView.addEventListener('click', (e) => {
        e.stopPropagation()
        completeCallback(todoItemView)
    })
    
    const removeButton = document.createElement('button')
    removeButton.innerText = '✖'
    removeButton.classList.add('remove-button')
    removeButton.addEventListener('click', (e) => {
        e.stopPropagation()
        removeCallback(todoItemView)  
    })

    todoItemView.appendChild(removeButton)
    return todoItemView
}