// Frontend
const JavaScriptList = require('./sidebar/Frontend/JavaScriptList');
const ES6PlusList = require('./sidebar/Frontend/ES6PlusList');
const TypeScriptList = require('./sidebar/Frontend/TypeScriptList');
const NextList = require('./sidebar/Frontend/NextList');
const InterviewList = require('./sidebar/Frontend/InterviewList');

// Backend
const NodeList = require('./sidebar/Backend/NodeList');
const PythonList = require('./sidebar/Backend/PythonList');
const PHPList = require('./sidebar/Backend/PHPList');

// Summary
const CryptocurrencyList = require('./sidebar/Summary/CryptocurrencyList');

const Day30List = require('./sidebar/2021iThomeList');

module.exports = {
  Frontend: [
    'Frontend/frontend-note',
    JavaScriptList,
    ES6PlusList,
    TypeScriptList,
    NextList,
    InterviewList,
  ],
  Backend: ['Backend/backend-note', NodeList, PythonList, PHPList],
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
  Summary: [CryptocurrencyList],
  Day30: ['day30-intro', Day30List],
};
