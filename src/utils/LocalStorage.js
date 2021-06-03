'use strict';

/**
 * takes key / value pair and stores data to localstorage after JSON.stringify is applied
 * @param {string} key - string to identify item being stored
 * @param {object} value - could be object, string, array
 */
function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
   return JSON.parse(localStorage.getItem(key));
}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
 {
     module.exports = 
     {
         setLocalStorage: setLocalStorage,
         getLocalStorage: getLocalStorage

     };
 }