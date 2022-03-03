// Frontend
const CSSList = require('./sidebar/Frontend/CSSList');
const JavaScriptList = require('./sidebar/Frontend/JavaScriptList');
const ES6PlusList = require('./sidebar/Frontend/ES6PlusList');
const TypeScriptList = require('./sidebar/Frontend/TypeScriptList');
const NextList = require('./sidebar/Frontend/NextList');
const ToolsList = require('./sidebar/Frontend/ToolsList');
const InterviewList = require('./sidebar/Frontend/InterviewList');
const GuideList = require('./sidebar/Frontend/GuideList');
const BrowserList = require('./sidebar/Frontend/BrowserList');

// Backend
const NodeList = require('./sidebar/Backend/NodeList');
const PythonList = require('./sidebar/Backend/PythonList');
const PHPList = require('./sidebar/Backend/PHPList');

// Reflection
const InvestList = require('./sidebar/Reflection/InvestList');
const MonthList = require('./sidebar/Reflection/MonthlyList');

module.exports = {
  Frontend: [
    'Frontend/frontend-entry',
    InterviewList,
    CSSList,
    JavaScriptList,
    ES6PlusList,
    TypeScriptList,
    NextList,
    BrowserList,
    ToolsList,
    GuideList,
  ],
  Backend: ['Backend/backend-note', NodeList, PythonList, PHPList],
  Reflection: ['Reflection/reflection-entry', InvestList, MonthList],
};
