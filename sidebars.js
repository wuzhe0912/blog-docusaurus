const JavaScriptList = require('./sidebar/SoftwareEngineer/javascript.js');
const NodeJSList = require('./sidebar/SoftwareEngineer/node.js');
const PHPList = require('./sidebar/SoftwareEngineer/php.js');
const MongoDBList = require('./sidebar/SoftwareEngineer/mongodb.js');
const LeetCodeList = require('./sidebar/SoftwareEngineer/leetCode.js');
// const BrowserList = require('./sidebar/SoftwareEngineer/browser.js');
const ComputerList = require('./sidebar/SoftwareEngineer/computer.js');
// Interview Questions
const HttpMethodsList = require('./sidebar/InterviewQuestions/httpMethods.js');
const JavaScriptQuestionList = require('./sidebar/InterviewQuestions/javascript.js');
// const ReactQuestionList = require('./sidebar/InterviewQuestions/react.js');
const VueQuestionList = require('./sidebar/InterviewQuestions/vue.js');
const CSSQuestionList = require('./sidebar/InterviewQuestions/css.js');
const BrowserQuestionList = require('./sidebar/InterviewQuestions/browser.js');
const ToolsList = require('./sidebar/InterviewQuestions/tools.js');
const WebSecurityList = require('./sidebar/InterviewQuestions/web-security.js');
const ExperienceList = require('./sidebar/InterviewQuestions/experience.js');
// ---Coding---
const CodingEasyList = require('./sidebar/CodingQuestions/coding-easy.js');

module.exports = {
  InterviewQuestions: [
    'InterviewQuestions/interview-questions',
    JavaScriptQuestionList,
    VueQuestionList,
    CSSQuestionList,
    ToolsList,
    BrowserQuestionList,
    HttpMethodsList,
    WebSecurityList,
    ExperienceList,
  ],
  Coding: ['Coding/coding', CodingEasyList],
  // SoftwareEngineer: [
  //   'SoftwareEngineer/software-engineer',
  //   JavaScriptList,
  //   NodeJSList,
  //   MongoDBList,
  //   PHPList,
  //   LeetCodeList,
  //   BrowserList,
  //   ComputerList,
  // ],
};
