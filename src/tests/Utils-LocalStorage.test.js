import { setLocalStorage, getLocalStorage } from '../utils/LocalStorage'

function cleanUp(key) {
    // Remove key from local storage
    localStorage.removeItem(key);
}

describe('valid setting and retrieval of local storage', () => {
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

});

describe('invalid settings', () => {
    test('Test retrieval of non-existant key', () => {
    
        const key = "test-data";
       
        expect(getLocalStorage(key)).toBe(null);
    
        cleanUp(key);
    });

    test('Test setting with invalid value set', () => {
    
        const key = "test-data";
       
        expect(setLocalStorage(key, '')).toBe(null);
    
        cleanUp(key);
    });

    test('Test setting with invalid key set', () => {
    
        const key = null;
       
        expect(setLocalStorage(key, [])).toBe(null);
    
        cleanUp(key);
    });

    test('Test setting with empty array set', () => {
    
        const key = "test-data";
       
        expect(setLocalStorage(key, [])).toBe(null);
    
        cleanUp(key);
    });
    
});

