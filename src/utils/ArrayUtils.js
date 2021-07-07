'use strict'

/**
 * RemoveItemFromArray - removes the specified index from the array and returns a COPY of the array. It does NOT modify the original array.
 * @param {array} array 
 * @param {number} index -location
 * @returns copied array with index removed / returns -1 for invalid slicing operation
 * // TODO: no try / catch?
 */
function RemoveItemFromArray(array, index) {
    if (!array || index < 0 || array.length < index) {
        return -1;
    }
    
    const results = array.filter(function(item, idx) {
        if(idx != index) //index you want to remove
        return item;
    });

    return results;
}
/**
 * Searched the document for the passed in element, and the returns a filtered array of those objects with the regex text content
 * @param {string} query can be the css selector '.class' or the element 'div' to filter on
 * @param {RegExp} regex the regex to filter on
 * // TODO: no try/catch
 * // TODO: explain background for this function, reason it exists
 * @returns 
 */
function FilterElementsOnTextContent(query, regex) {
    const results = Array.from(document.querySelectorAll(query))
        .reduce((acc, el) => {
            if (el.textContent.match(regex) !== null) {
                acc.push(el);
            }
            return acc;
        }, []);
    return results;
}


function ArrayUtils() {
    return {
        FilterElementsOnTextContent,
        RemoveItemFromArray
    }
}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {

    module.default = ArrayUtils;
    module.exports = {
        RemoveItemFromArray: RemoveItemFromArray,
        FilterElementsOnTextContent: FilterElementsOnTextContent
    };
 }