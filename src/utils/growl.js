'use strict';

// Growl to function without JQUERY using just JavaScript and Bulma framework

/**
 * 
 * @param {DOM} elementID element ID on page to render growl to
 * @param {string} msg message in growl
 * @param {string} level info, success, warning, danger
 * @param {string} title optional parameter that displays title of growl
 */
function renderGrowl(elementID, msg, level, title = '', timeout = true) {

    // need to validate parameters
    if (!elementID || !msg || !level) {
        console.warn('unable to process growl with missing parameters');
        console.log(`elementID: ${elementID}\n
        msg: ${msg}\n
        level: ${level}\n`);
        return;
    }

    const root = document.querySelector(`#${elementID}`)
    if (!root) {
        console.warn('unable to find specified elementID on page, cannot render growl');
        console.log(`elementID: ${elementID}`);
        return;
    }
    
    const article = document.createElement('article');
    article.className = `tile is-child notification is-${level} growling removed`;

    const growlContent = document.createElement('p');
    growlContent.className = 'subtitle';
    growlContent.textContent = msg;

    let growlTitle = '';
    if (title != '') {
        growlTitle = document.createElement('p');
        growlTitle.className = 'title';
        growlTitle.textContent = title;
        article.appendChild(growlTitle);
    }

    article.appendChild(growlContent);

    root.appendChild(article);

    if (timeout) {
        let timer = setTimerToRemoveGrowl(article);
        
        setListener(article, timer);
    }
}

function setTimerToRemoveGrowl(element, timeout=5000) {
    let timer = setTimeout(function() {
        element.remove();
    }, timeout);
    return timer;
}

function setListener(element, timer) {
    
    element.addEventListener('mouseover', () => {
        console.log(timer);
        element.classList.remove('removed');
        clearTimeout(timer);
    });
    
    element.addEventListener('mouseout', () => {
        clearTimeout(timer);
        element.classList.add('removed');
        setTimerToRemoveGrowl(element, 30000);
    });
}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        renderGrowl: renderGrowl
    };
}