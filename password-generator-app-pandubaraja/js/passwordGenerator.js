export default class PasswordGenerator {
    constructor() {
        this.defaultOptions = {
            lowercase: true,
            uppercase: true,
            numbers: true,
            symbols: true
        } 
        
        this.charSets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        }
    }

    generatePassword(length, options = {}) {
        const config = { ...this.defaultOptions, ...options }

        let allowedChars = ''

        for (const [key, value] of Object.entries(config)) {
            if (value && this.charSets[key]) {
                allowedChars += this.charSets[key]
            }
        }

        if (allowedChars.length === 0) {
            return {
                'status': 'error',
                'message': 'Error: At least one character type must be selected.'
            }
        }

        let password = ''

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allowedChars.length);
            password += allowedChars[randomIndex]
        }

        return {
            'status': 'success',
            'data': password
        }
    }
}