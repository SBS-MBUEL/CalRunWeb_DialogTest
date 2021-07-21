'use strict'

/**
 * RemoveItemFromArray - removes the specified index from the array and returns a COPY of the array. It does NOT modify the original array.
 * @param {array} array 
 * @param {number} index -location
 * @returns copied array with index removed / returns -1 for invalid slicing operation
 */
function RemoveItemFromArray(array, index) {
    if (!array || index < 0 || array.length < index) {
        return -1;
    }
    try {
        const results = array.filter(function(item, idx) {
            if(idx != index) //index you want to remove
            return item;
        });
        return results;

    } catch (ex) {
        // TODO: not sure what error could happen from above, need to research - try to catch with testing
        return -1;
    }
}
/**
 * Searched the document for the passed in element, and the returns a filtered array of those objects with the regex text content
 * @param {string} query can be the css selector '.class' or the element 'div' to filter on
 * @param {RegExp} regex the regex to filter on
 * // TODO: explain background for this function, reason it exists
 * @returns 
 */
function FilterElementsOnTextContent(query, regex) {
    try {
        const results = Array.from(document.querySelectorAll(query))
            .reduce((acc, el) => {
                if (el.textContent.match(regex) !== null) {
                    acc.push(el);
                }
                return acc;
            }, []);
    } catch (ex) {
        // TODO: need to try and define error and capture / test for
    }
    return results;
}

/**
 * The goal of this method is to find a unique index in the settings object by supplying two key value pairs.
 * @param {object} settings object
 * @param {string} key1 field name, for example label
 * @param {string} value1 of field1
 * @param {string} key2 field name, for example value
 * @param {string} value2 of field2
 * @return {number}
 */
function FindUniqueIndexInSettings(settings, key1, value1, key2, value2) {
    if ((!settings && typeof(settings) !== 'object') || (!key1 && typeof(key1) !== 'string') || (!key2 && typeof(key2) !== 'string') || (!value1 && typeof(value1) !== 'string') || (!value2 && typeof(value2) !== 'string') ) {
        // problem with arguments
        return -1;
    }
    try {
        let indice = settings.map((el, index) => el[key1].toLowerCase() === value1.toLowerCase() && el[key2].toLowerCase() === value2.toLowerCase() ? index : undefined).filter((a, b) => a !== undefined);

        if (!indice[0] || indice.length > 1) {
            // search query is not returning a unique result.
            return -1; 
        }
        return indice[0];
    } catch (er) {
        return -1;
    }
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