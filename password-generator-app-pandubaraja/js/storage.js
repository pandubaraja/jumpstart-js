export default class Storage {
    constructor(storageType = 'localStorage') {
        this.storage = storageType === 'localStorage' ? localStorage : sessionStorage
    }

    save(key, value) {
        try {
            const serializedValue = JSON.stringify(value)
            this.storage.setItem(key, serializedValue)
            return true
        } catch (error) {
            console.error('Error saving data:', error);
            return false
        }
    }

    get(key) {
        try {
            const serializedValue = this.storage.getItem(key)
            return serializedValue ? JSON.parse(serializedValue) : null
        } catch (error) {
            console.error('Error retrieving data:', error);
            return null
        }
    }

    clear() {
        try {
            this.storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }
}