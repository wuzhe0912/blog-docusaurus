const JavaScriptList = require('./sidebar/SoftwareEngineer/javascript.js');
const NodeJSList = require('./sidebar/SoftwareEngineer/node.js');
const PHPList = require('./sidebar/SoftwareEngineer/php.js');
const BrowserList = require('./sidebar/SoftwareEngineer/browser.js');
const ComputerList = require('./sidebar/SoftwareEngineer/computer.js');

module.exports = {
  SoftwareEngineer: [
    'SoftwareEngineer/software-engineer',
    JavaScriptList,
    NodeJSList,
    PHPList,
    BrowserList,
    ComputerList,
  ],
};
