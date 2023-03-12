export function storeItem(key, value, stringifyContent, useSessionStorage) {
    try {
        if(!useSessionStorage)
            localStorage.setItem(key, stringifyContent ? JSON.stringify(value) : value);
        else
            sessionStorage.setItem(key, stringifyContent ? JSON.stringify(value) : value);
    } catch (error) {
        console.log("An error occurred while attempting to store item...", error);
    }
}

export function retriveItem(key, useSessionStorage) {
    try {
        const value = !useSessionStorage ? localStorage.getItem(key) : sessionStorage.getItem(key);
        return value;
    } catch (error) {
        console.log("An error occurred while attempting to retrive item...", error);
        return null;
    }
}

export function removeItem(key, useSessionStorage){
    try {
        if(!useSessionStorage)
            localStorage.removeItem(key);
        else
            sessionStorage.removeItem(key);
    } catch (error) {
        console.log("An error occurred while attempting to remove item...", error);
    }
}