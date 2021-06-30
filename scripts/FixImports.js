// Created this script to clean up files for production / test use - the React files use imports to allow unit testing
// those imports do not work in the production/ test environment
// This is a brute force solution - removing the import statements which should prevent the code from crashing.

//requiring path and fs modules
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const FileReader = require('filereader');

const regex_replacements = [
    {
        regex: /var _[aA-zZ]*(|[0-9]) = (require|_interopRequireDefault)\((('|")(|\.(.)?\/[aA-zZ]*(|\/)))?[_]?[aA-zZ]*[('|")]?\);/g,
        replace: ''
    },
    {
        regex: /_react(|[0-9])\.default/g,
        replace: 'React'
    },
    {
        regex: /_ConfigurationDisplayHeading\./g,
        replace: ''
    },
    {
        regex: /_createGUID(|[0-9])\.default/g,
        replace: 'createGUID'
    },
    {
        regex: /_PanelContent\./g,
        replace: ''
    },
    {
        regex: /_ConfigPageRow\./g,
        replace: ''
    },
    {
        regex: /_SubOptions\./g,
        replace: ''
    },
    {
        regex: /_TabListItem\./g,
        replace: ''
    },
    {
        regex: /_TabPanels\./g,
        replace: ''
    },
    {
        regex: /_TabLinkContainer\./g,
        replace: ''
    },
    {
        regex: /_DropDownContainer(|[0-9])\.(|default)/g,
        replace: ''
    },
    {
        regex: /_DropDownItem(|[0-9])\.(|default)/g,
        replace: ''
    },
    {
        regex: /_ErrorPage(|[0-9])\.(|default)/g,
        replace: ''
    },
    {
        regex: /_InputItem(|[0-9])\.(|default)/g,
        replace: ''
    },
    {
        regex: /_LocalStorage\.(|default)/g,
        replace: ''
    },
    {
        regex: /_TextArea\.(|default)/g,
        replace: ''
    },
    {
        regex: /_ButtonItem\.(|default)/g,
        replace: ''
    },
    {
        regex: /_ErrorRow\.(|default)/g,
        replace: ''
    },
    {
        regex: /\(0, _growl\.renderGrowl\)/g,
        replace: 'renderGrowl'
    },
    {
        regex: /_PanelNavigation\.(|default)/g,
        replace: ''
    },
    {
        regex: /_rowContentContainer\.(|default)/g,
        replace: ''
    },
    {
        regex: /_RemoveItemFromArray\.(|default)/g,
        replace: 'RemoveItemFromArray'
    },
]

const root_search_path = path.join(__dirname, '../js');


iterate(root_search_path)
    .then(function(results) {
        console.log(results);
        results.map((file, index) => {

            const txt = readFileSync(file); // Todo: try to improve to be asynchronous

            let res = txt;
            regex_replacements.forEach((el, i) => {
                res = removeOrReplaceString(res, el.regex, el.replace);
            });


            if (res !== txt) {
                console.log(`replacement in ${file}`);
                saveFileSync(file, res);
            }
            
        });
    })
    .catch(err => console.error(err));

/**
 * 
 * @param {*} dir 
 * @returns 
 */
fs.readdirAsync = function(dir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, function(err, list) {
            if (err) {
                reject(err);
            } else {
                resolve(list);
            }
        });
    });
}

/**
 * determines if passed in File object is a directory or file
 * @param {File} file 
 * @returns stat of file
 */
fs.statAsync = function(file) {
    return new Promise(function(resolve, reject) {
        fs.stat(file, function(err, stat) {
            if (err) {
                reject(err);
            } else {
                resolve(stat);
            }
        });
    });
}

/**
 * reads passed in dir to determine sub directories
 * @param {path} dir 
 * @returns array of directories
 */
function iterate(dir) {
    return fs.readdirAsync(dir).map(function(file) {
        file = path.resolve(dir, file);
        return fs.statAsync(file).then(function(stat) {
            if (stat.isDirectory()) {
                return iterate(file);
            } else {
                return file;
            }
        })
    }).then(function(results) {
        // flatten the array of arrays
        return Array.prototype.concat.apply([], results);
    });
}

/**
 * removeOrReplaceString targets specific blocks of text and removes them from the source text (txt)
 * @param {string} txt large blob of text (read from file) to replace
 * @param {regex} filter regex to target
 * @param {string} replacement text to insert - by default it is set to an empty string which will remove the regex target
 * @returns 
 */
function removeOrReplaceString(txt, filter, replacement='') {
    return txt.replace(filter, replacement);
}

/**
 * simple synchronous save file method
 * @param {string} file 
 * @param {path} txt 
 */
function saveFileSync(file, txt) {
    fs.writeFileSync(file, txt);
}

/**
 * reads file at a specific path and returns string
 * @param {File} file 
 * @returns string of results
 */
function readFileSync(file) {
    return file && fs.readFileSync(file, {encoding:'utf8', flag:'r'});
}