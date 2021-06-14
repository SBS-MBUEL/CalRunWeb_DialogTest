'use strict';

// Growl to function without JQUERY using just JavaScript and Bulma framework

/**
 * 
 * @param {DOM} elementID element ID on page to render growl to
 * @param {string} msg message in growl
 * @param {string} level info, success, warning, danger
 * @param {string} title optional parameter that displays title of growl
 */
function renderGrowl(elementID, msg, level, title='') {
    // need to validate parameters
    const root = document.querySelector(`#${elementID}`)

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

    let timer = setTimerToRemoveGrowl(article);
    
    setListener(article, timer);
}

function setTimerToRemoveGrowl(element, timeout=5000) {
    return setTimeout(() => {
        element.remove();
    }, timeout);
}

function setListener(element, timer) {
    element.addEventListener('mouseover', () => {
        clearTimeout(timer);

        element.addEventListener('mouseout', () => {
            setTimerToRemoveGrowl(element);
        });
    });

}