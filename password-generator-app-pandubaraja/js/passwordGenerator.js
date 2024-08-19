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
                'message': 'Error: At least one rule type must be selected.'
            }
        }

        let password = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allowedChars.length);
            password += allowedChars[randomIndex]
        }

        const strength = this.passwordStrengthCheck(password)

        return {
            'status': 'success',
            'data': {
                password,
                ...strength   
            }
        }
    }

    passwordStrengthCheck = (password) => {
        const minLength = 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

        let score = 0;
        
        if (password.length >= minLength) score++;
        if (hasUpperCase) score++;
        if (hasLowerCase) score++;
        if (hasNumbers) score++;
        if (hasSpecialChar) score++;

        let strength = '';
        if (score === 5) {
            strength = {
                strength: 'Very Strong',
                color: '#008000'
            }
        } else if (score === 4) {
            strength = {
                strength: 'Strong',
                color: '#9ACD32'
            }
        } else if (score === 3) {
            strength = {
                strength: 'Moderate',
                color: '#FFD700'
            }
        } else if (score === 2) {
            strength = {
                strength: 'Weak',
                color: '#FF8C00'
            }
        } else {
            strength = {
                strength: 'Very Weak',
                color: '#FF0000'
            }
        }

        return strength
    }
}