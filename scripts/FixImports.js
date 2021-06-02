// Created this script to clean up files for production / test use - the React files use imports to allow unit testing
// those imports do not work in the production/ test environment
// This is a brute force solution - removing the import statements which should prevent the code from crashing.

//requiring path and fs modules
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const FileReader = require('filereader');
// const { dir } = require('console');

const regex_imports = /var _[aA-zZ]*(|[0-9]) = (require|_interopRequireDefault)\((('|")(|\.(.)?\/[aA-zZ]*(|\/)))?[_]?[aA-zZ]*[('|")]?\);/g;
const regex_react = /_react(|[0-9])\.default/g;
const regex_createGuid = /_createGUID(|[0-9])\.default/g;
const regex_ConfigurationDisplayHeading = /_ConfigurationDisplayHeading\./g;
const regex_ConfigurationSetup = /_ConfigurationSetup\./g;
const regex_ConfigPageRow = /_ConfigPageRow\./g;
const regex_SubOptions = /_SubOptions\./g;
const regex_TabListItem = /_TabListItem\./g;
const regex_TabPanels = /_TabPanels\./g;
const regex_TabLinkContainer = /_TabLinkContainer\./g;
const regex_DropDownList = /_DropDownList(|[0-9])\.(|default)/g;
const regex_DropDownItem = /_DropDownItem(|[0-9])\.(|default)/g;
const regex_InputItem = /_InputItem(|[0-9])\.(|default)/g;
const regex_ErrorPage = /_ErrorPage(|[0-9])\.(|default)/g;
const regex_LocalStorage = /_LocalStorage\.(|default)/g;
const regex_TextArea = /_TextArea\.(|default)/g;
const regex_ButtonItem = /_ButtonItem\.(|default)/g;
const regex_ErrorRow = /_ErrorRow\.(|default)/g;

const root_search_path = path.join(__dirname, '../js');


iterate(root_search_path)
    .then(function(results) {
        console.log(results);
        results.map((file, index) => {

            const txt = readFileSync(file); // Todo: try to improve to be asynchronous
            let res = removeOrReplaceString(txt, regex_imports);
            res = removeOrReplaceString(res, regex_react, 'React');
            res = removeOrReplaceString(res, regex_createGuid, 'createGUID');
            res = removeOrReplaceString(res, regex_ConfigurationDisplayHeading);
            res = removeOrReplaceString(res, regex_ConfigurationSetup);
            res = removeOrReplaceString(res, regex_ConfigPageRow);
            res = removeOrReplaceString(res, regex_SubOptions);
            res = removeOrReplaceString(res, regex_SubOptions);
            res = removeOrReplaceString(res, regex_TabLinkContainer);
            res = removeOrReplaceString(res, regex_TabListItem);
            res = removeOrReplaceString(res, regex_TabPanels);
            res = removeOrReplaceString(res, regex_DropDownList);
            res = removeOrReplaceString(res, regex_DropDownItem);
            res = removeOrReplaceString(res, regex_InputItem);
            res = removeOrReplaceString(res, regex_ErrorPage);
            res = removeOrReplaceString(res, regex_LocalStorage);
            res = removeOrReplaceString(res, regex_TextArea);
            res = removeOrReplaceString(res, regex_ButtonItem);
            res = removeOrReplaceString(res, regex_ErrorRow);

            if (res !== txt) {
                console.log(`replacement in ${file}`);
                saveFileSync(file, res);
            }
            
        });
    })
    .catch(err => console.error(err));

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

function removeOrReplaceString(txt, filter, replacement='') {
    return txt.replace(filter, replacement);
}

/**
 * Promisified FileReader
 * More info https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 * @param {*} file
 * @param {*} method: readAsArrayBuffer, readAsBinaryString, readAsDataURL, readAsText
 */
 const readFile = async (file = {}, method = 'readAsText') => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader[method](file)
      reader.onload = () => {
        resolve(reader)
      }
      reader.onerror = (error) => reject(error)
    })
}

async function readFile2(file) {

    return new Promise((resolve, reject) => {
      
        var reader = new FileReader();
        reader.addEventListener('load', file => resolve(file.target.result));
        reader.addEventListener('error', reject);
        reader.readAsText(file);

    });
  }

  function saveFileSync(file, txt) {
      fs.writeFileSync(file, txt);
  }

 function readFileSync(file){
     return file && fs.readFileSync(file, {encoding:'utf8', flag:'r'});
    
  }