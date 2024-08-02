//#region Validation
export const isNotBlank = (value) => {
    return {
        isValid: value.trim().length > 0,
        message: 'Value is required!'
    }
}
export const isAlphabet = (value) => {
    return {
        isValid: /^[A-Za-z]+$/.test(value),
        message: 'Value should be alphabet!'
    }
}

export function validation(value, validators) {
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