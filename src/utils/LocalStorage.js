'use strict';

/**
 * takes key / value pair and stores data to localstorage after JSON.stringify is applied
 * @param {string} key - string to identify item being stored
 * @param {object} value - could be object, string, array - cannot be an undefined, null, empty string or empty array
 */
function setLocalStorage(key, value) {
    if (!key || !value || value.length <= 0) {
        // console.error(`Not storing anything to Local Storage.\nkey: ${JSON.stringify(key)}\nvalue: ${JSON.stringify(value)}`);
        return null;
    }

    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * getLocalStorage, retrieves item from localStorage
 * @param {string} key - string to retrieve item
 * @returns null for error, object/string/array for valid value
 */
function getLocalStorage(key) {
    if (!key) {
        // console.error(`Cannot retrieve Local Storage with an empty key value\nkey: ${JSON.stringify(key)}`);
        return null;
    }

    const results = JSON.parse(localStorage.getItem(key));

    if (!results) {
        // console.warn(`The provided key does not exist in local storage`);
    }

    return results;
}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     module.exports = {
         setLocalStorage: setLocalStorage,
         getLocalStorage: getLocalStorage

     };
 }