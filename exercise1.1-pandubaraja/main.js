function greetUser() {
    const divDom = document.getElementById("greeting")
    const textDom = document.getElementById("nameInput")
    const textValue = textDom.value

    const result = validation(textValue, [isNotBlank, isAlphabet])

    if (result.isValid) {
        handleSuccess()
    } else {
        handleError(result.errors)
    }
    
    function handleError(errors) {
        divDom.innerHTML = ''

        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'error-container')

        const ul =  document.createElement('ul')

        for (error of errors) {
            const li = document.createElement('li')
            li.textContent = error
            ul.appendChild(li)
        }

        wrapper.appendChild(ul)
        divDom.appendChild(wrapper)
    }

    function handleSuccess() {
        divDom.innerHTML = ''
        divDom.textContent = `Good ${getTimeOfDay()}, ${textValue}!`
    }

    function getTimeOfDay() {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 5 && hours < 12) {
            return 'Morning';
        } else if (hours >= 12 && hours < 17) {
            return 'Afternoon';
        } else if (hours >= 17 && hours < 21) {
            return 'Evening';
        } else {
            return 'Night';
        }
    }
}

//#region Validation
const isNotBlank = (value) => {
    return {
        isValid: value.trim().length > 0,
        message: 'Value is required!'
    }
}

const isAlphabet = (value) => {
    return {
        isValid: isNaN(value),
        message: 'Value should be alphabet!'
    }
}

function validation(value, validators) {
    const errors = []

    for (let validator of validators) {
        const result = validator(value)

        if (!result.isValid) {
            errors.push(result.message)
        }
    }

    const isValid = errors.length == 0

    return {
        isValid: isValid,
        errors: isValid ? null : errors
    }
}
//#endregion Validation