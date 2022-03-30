// Basics
const CSSWorldList = require('./sidebar/Basics/CSSWorldList');
const JSBasicsList = require('./sidebar/Basics/JSBasicsList');
const NetworkList = require('./sidebar/Basics/NetworkList');
const BrowserList = require('./sidebar/Basics/BrowserList');
const ToolsList = require('./sidebar/Basics/ToolsList');
const LeetCodeList = require('./sidebar/Basics/LeetCodeList');

// Read
const HistoryList = require('./sidebar/Read/HistoryList');

// const ES6PlusList = require('./sidebar/Frontend/ES6PlusList');
// const TypeScriptList = require('./sidebar/Frontend/TypeScriptList');
// const NextList = require('./sidebar/Frontend/NextList');

// Backend
// const NodeList = require('./sidebar/Backend/NodeList');
// const PythonList = require('./sidebar/Backend/PythonList');
// const PHPList = require('./sidebar/Backend/PHPList');

module.exports = {
  Basics: [
    'Basics/collection',
    CSSWorldList,
    JSBasicsList,
    NetworkList,
    BrowserList,
    ToolsList,
    LeetCodeList,
    // InterviewList,
    // ES6PlusList,
    // TypeScriptList,
    // NextList,
  ],
  Read: ['Read/summary', HistoryList],
};
