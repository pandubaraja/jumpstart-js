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

        this.init()
    }

    init = () => {
        this.generateBtn.addEventListener('click', (e) => {
            this.generatePassword()
        })

        this.copyBtn.addEventListener('click', (e) => {
            navigator.clipboard.writeText(this.passwordEl.value)
                .then(() => {
                    alert('Password copied to clipboard')
                })
                .catch((error) => {
                    alert("Failed to copy text: ", error)
                })
        })
    }

    generatePassword = () => {
        const length = parseInt(this.lengthEl.value)
        const result = this.passwordGenerator.generatePassword(length)

        switch (result.status) {
            case 'success':
                const url = this.urlEl.value
                const password = result.data
                this.passwordEl.value = password

                this.savePassword({
                    password,
                    url
                })
                break;
            case 'error':
                console.log(error)
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App(new PasswordGenerator(), new Storage())
});