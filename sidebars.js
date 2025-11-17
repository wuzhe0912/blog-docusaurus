// ---Knowledge (深度概念講解)---
const HttpKnowledgeList = require('./sidebar/Knowledge/http.js');
const BrowserKnowledgeList = require('./sidebar/Knowledge/browser.js');
const ToolsKnowledgeList = require('./sidebar/Knowledge/tools.js');
// ProjectCaseList 已移除：專案實戰案例已移至 Experience/Performance 和 Experience/Project-Architecture
// ---Quiz (快速問答測驗)---
const QuizJavaScriptList = require('./sidebar/Quiz/quiz-javascript.js');
const QuizTypeScriptList = require('./sidebar/Quiz/quiz-typescript.js');
const QuizReactList = require('./sidebar/Quiz/quiz-react.js');
const QuizVueList = require('./sidebar/Quiz/quiz-vue.js');
const QuizCSSList = require('./sidebar/Quiz/quiz-css.js');
const QuizSecurityList = require('./sidebar/Quiz/security.js');
// ---Coding (手寫程式實現)---
const LodashFunctionsList = require('./sidebar/Coding/lodash-functions.js');
const JavaScriptList = require('./sidebar/Coding/javascript.js');
// ---LeetCode (演算法題)---
const LeetCodeEasyList = require('./sidebar/LeetCodeQuestions/leet-code-easy.js');
// ---Experience (面試經驗)---
const ExperienceList = require('./sidebar/Experience/experience.js');
// ---AI---
const AIPromptsList = require('./sidebar/AI/prompts.js');
// ---ShowCase---
const ChatifyList = require('./sidebar/ShowCase/chatify.js');

module.exports = {
  Knowledge: [
    'Knowledge/knowledge',
    HttpKnowledgeList,
    BrowserKnowledgeList,
    ToolsKnowledgeList,
    {
      type: 'category',
      label: '📝 Quiz 測驗',
      collapsible: true,
      collapsed: true,
      items: [QuizJavaScriptList, QuizTypeScriptList, QuizReactList, QuizVueList, QuizCSSList, QuizSecurityList],
    },
  ],
  Coding: ['Coding/coding', LodashFunctionsList, JavaScriptList],
  LeetCode: ['LeetCode/leet-code', LeetCodeEasyList],
  Experience: ['Experience/experience', ExperienceList],
  AI: ['AI/ai-index', AIPromptsList],
  ShowCase: ['ShowCase/showcase', ChatifyList],
};
