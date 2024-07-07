// ---Interview Questions---
const HttpQuestionList = require('./sidebar/InterviewQuestions/http.js');
const JavaScriptQuestionList = require('./sidebar/InterviewQuestions/javascript.js');
const VueQuestionList = require('./sidebar/InterviewQuestions/vue.js');
const ReactQuestionList = require('./sidebar/InterviewQuestions/react.js');
const CSSQuestionList = require('./sidebar/InterviewQuestions/css.js');
const BrowserQuestionList = require('./sidebar/InterviewQuestions/browser.js');
const ToolsList = require('./sidebar/InterviewQuestions/tools.js');
const WebSecurityList = require('./sidebar/InterviewQuestions/web-security.js');
const ExperienceList = require('./sidebar/InterviewQuestions/experience.js');
// ---Coding---
const LodashFunctionsEasyList = require('./sidebar/Coding/lodash-functions-easy.js');
// ---Quiz---
const QuizJavaScriptList = require('./sidebar/Quiz/quiz-javascript.js');
// ---LeetCode---
const LeetCodeEasyList = require('./sidebar/LeetCodeQuestions/leet-code-easy.js');

module.exports = {
  InterviewQuestions: [
    'InterviewQuestions/interview-questions',
    JavaScriptQuestionList,
    VueQuestionList,
    ReactQuestionList,
    CSSQuestionList,
    ToolsList,
    BrowserQuestionList,
    HttpQuestionList,
    WebSecurityList,
    ExperienceList,
  ],
  Coding: ['Coding/coding', LodashFunctionsEasyList],
  Quiz: ['Quiz/quiz', QuizJavaScriptList],
  LeetCode: ['LeetCode/leet-code', LeetCodeEasyList],
};
