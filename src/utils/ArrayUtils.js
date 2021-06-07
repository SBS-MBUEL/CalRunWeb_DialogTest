'use strict'

/**
 * RemoveItemFromArray - removes the specified index from the array and returns a COPY of the array. It does NOT modify the original array.
 * @param {array} array 
 * @param {number} index 
 * @returns copied array with index removed / returns -1 for invalid slicing operation
 */
function RemoveItemFromArray(array, index) {
    if (!array || index < 0 || array.length < index) {
        return -1;
    }
    const copiedArray = array.slice('');

    const results = [...copiedArray.splice(0, index), ...copiedArray.splice(index - 1)];

    return results;
}

function FilterElementsOnTextContent(element, regex) {
    const results = Array.from(document.querySelectorAll(element))
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
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
 {

    module.default = ArrayUtils;
    module.exports = {
        RemoveItemFromArray: RemoveItemFromArray,
        FilterElementsOnTextContent: FilterElementsOnTextContent
    };
 }