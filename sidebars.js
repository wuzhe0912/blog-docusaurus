// Language
const JavaScriptList = require('./sidebar/SoftwareEngineer/javascript.js');
const NodeJSList = require('./sidebar/SoftwareEngineer/node.js');
const PHPList = require('./sidebar/SoftwareEngineer/php.js');
const MongoDBList = require('./sidebar/SoftwareEngineer/mongodb.js');
// Interview - Temp Remove
const LeetCodeList = require('./sidebar/SoftwareEngineer/leetCode.js');
const BrowserList = require('./sidebar/SoftwareEngineer/browser.js');
const ComputerList = require('./sidebar/SoftwareEngineer/computer.js');
// Interview Questions
const HttpMethodsList = require('./sidebar/InterviewQuestions/httpMethods.js');
const JavaScriptQuestionList = require('./sidebar/InterviewQuestions/javascript.js');
// const ReactQuestionList = require('./sidebar/InterviewQuestions/react.js');
const VueQuestionList = require('./sidebar/InterviewQuestions/vue.js');

module.exports = {
  SoftwareEngineer: [
    'SoftwareEngineer/software-engineer',
    JavaScriptList,
    NodeJSList,
    MongoDBList,
    PHPList,
    LeetCodeList,
    BrowserList,
    ComputerList,
  ],
  InterviewQuestions: [
    'InterviewQuestions/interview-questions',
    HttpMethodsList,
    JavaScriptQuestionList,
    VueQuestionList,
  ],
};
