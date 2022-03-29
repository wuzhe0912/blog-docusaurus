// Basics
const CSSWorldList = require('./sidebar/Basics/CSSWorldList');
const JSBasicsList = require('./sidebar/Basics/JSBasicsList');
const BrowserList = require('./sidebar/Basics/BrowserList');
const ToolsList = require('./sidebar/Basics/ToolsList');
// const ES6PlusList = require('./sidebar/Frontend/ES6PlusList');
// const TypeScriptList = require('./sidebar/Frontend/TypeScriptList');
// const NextList = require('./sidebar/Frontend/NextList');
// const InterviewList = require('./sidebar/Frontend/InterviewList');

// Backend
const NodeList = require('./sidebar/Backend/NodeList');
const PythonList = require('./sidebar/Backend/PythonList');
const PHPList = require('./sidebar/Backend/PHPList');

module.exports = {
  Basics: [
    'Basics/collection',
    CSSWorldList,
    JSBasicsList,
    BrowserList,
    ToolsList,
    // InterviewList,
    // ES6PlusList,
    // TypeScriptList,
    // NextList,
  ],
  // Backend: ['Backend/backend-note', NodeList, PythonList, PHPList],
};
