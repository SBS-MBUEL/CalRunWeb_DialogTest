import { setLocalStorage, getLocalStorage } from '../utils/LocalStorage'

function cleanUp(key) {
    // Remove key from local storage
    localStorage.removeItem(key);
}

test('Test setting and retrieval of valid storage', () => {
    const expected = {
        test1: true,
        test2: false
    }

    const key = "test-data";
    setLocalStorage(key, expected);

    expect(getLocalStorage(key).test1).toBe(true);
    expect(getLocalStorage(key).test2).toBe(false);

    cleanUp(key);
});


test('Test update of existing item', () => {
    const expected = {
        test1: true,
        test2: false
    }

    const key = "test-data";
    setLocalStorage(key, expected);

    const copiedData = expected;
    copiedData.test1 = false;
    copiedData.test2 = true;

    setLocalStorage(key, copiedData);
    
    expect(getLocalStorage(key).test1).toBe(false);
    expect(getLocalStorage(key).test2).toBe(true);

    cleanUp(key);
});

test('Test retrieval of non-existant key', () => {

    const key = "test-data";
   
    expect(getLocalStorage(key)).toBe(null);

    cleanUp(key);
});