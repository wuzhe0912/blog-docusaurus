// Frontend
const JavaScriptList = require('./sidebar/Frontend/JavaScriptList');
const ES6PlusList = require('./sidebar/Frontend/ES6PlusList');
const TypeScriptList = require('./sidebar/Frontend/TypeScriptList');
const NextList = require('./sidebar/Frontend/NextList');
const ToolsList = require('./sidebar/Frontend/ToolsList');

// Backend
const NodeList = require('./sidebar/Backend/NodeList');
const PythonList = require('./sidebar/Backend/PythonList');
const PHPList = require('./sidebar/Backend/PHPList');

// Interview
const LeetCodeList = require('./sidebar/Interview/LeetCodeList');

module.exports = {
  Frontend: [
    'Frontend/frontend-note',
    JavaScriptList,
    ES6PlusList,
    TypeScriptList,
    NextList,
    ToolsList,
  ],
  Backend: ['Backend/backend-note', NodeList, PythonList, PHPList],
  Interview: ['Interview/interview-entry', LeetCodeList],
  Computer: [
    {
      type: 'category',
      label: 'Terminal',
      items: [
        'Computer/Terminal/00-cmder',
        'Computer/Terminal/01-command-line',
      ],
    },
    {
      type: 'category',
      label: 'Browser',
      items: ['Computer/Browser/00-ip'],
    },
  ],
};
