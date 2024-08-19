import PasswordGenerator from "./passwordGenerator.js";
import Storage from "./storage.js";

class App {
    constructor(passwordGenerator, storage) {
        this.passwordGenerator = passwordGenerator
        this.storage = storage


        this.generateBtn = document.getElementById('generate')
        this.copyBtn = document.getElementById('copy')
        this.passwordEl = document.getElementById('password')
        this.lengthEl = document.getElementById('length')
        this.urlEl = document.getElementById('url')
        this.uppercaseCheck = document.getElementById('uppercase')
        this.lowercaseCheck = document.getElementById('lowercase')
        this.numberCheck = document.getElementById('number')
        this.symbolCheck = document.getElementById('symbol')
        this.strength = document.getElementById('strength')
        this.histories = document.getElementById('histories')

        this.init()
    }

    init = () => {
        this.generateBtn.addEventListener('click', (e) => {
            this.generatePassword()
        })

        this.copyBtn.addEventListener('click', (e) => {
            this.copyToClipboard(this.passwordEl.value)
        })

        this.renderPasswordHistories()
    }

    generatePassword = () => {
        const length = parseInt(this.lengthEl.value)

        const result = this.passwordGenerator.generatePassword(
            length,
            {
                uppercase: this.uppercaseCheck.checked,
                lowercase: this.lowercaseCheck.checked,
                numbers: this.numberCheck.checked,
                symbols: this.symbolCheck.checked
            }
        )

        switch (result.status) {
            case 'success':
                const url = this.urlEl.value
                const password = result.data.password
                this.passwordEl.value = password
                this.strength.textContent = result.data.strength
                this.strength.setAttribute('style', `color: ${result.data.color}; font-weight: bold;`) 

                this.savePassword({
                    password,
                    url
                })
                break;
            case 'error':
                alert(result.message)
                break;
            default: break;
        }
    }

    savePassword(data) {
        const passwordData = this.storage.get('passwords')
        const newPasswordData = passwordData ? passwordData : []

        newPasswordData.unshift(data)

        if (newPasswordData.length > 5) newPasswordData.pop()
    
        this.storage.save('passwords', newPasswordData)

        this.renderPasswordHistories()
    }

    renderPasswordHistories = () => {
        this.histories.innerHTML = ''
        const stored = this.storage.get('passwords')

        if (stored) {
            stored.forEach((element, index) => {
                const row = document.createElement('div')
                row.classList.add('history-item')
                row.innerHTML = `
                    <div>${index + 1}</div>
                    <div>${element.url ? element.url : 'none'}</div>
                    <div>${element.password}</div>
                `
    
                row.addEventListener('click', (e) => {
                    e.stopPropagation()
                    this.copyToClipboard(element.password)
                })
                this.histories.appendChild(row)
            });
        }
        else {
            this.histories.innerHTML = '<p>No password histories</p>'
        }   
    }

    copyToClipboard = (data) => {
        navigator.clipboard.writeText(data)
            .then(() => {
                alert('Password copied to clipboard')
            })
            .catch((error) => {
                alert("Failed to copy text: ", error)
            })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App(new PasswordGenerator(), new Storage())
});