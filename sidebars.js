// ---Knowledge (深度概念講解)---
const HttpKnowledgeList = require('./sidebar/Knowledge/http.js');
const JavaScriptKnowledgeList = require('./sidebar/Knowledge/javascript.js');
const VueKnowledgeList = require('./sidebar/Knowledge/vue.js');
const ReactKnowledgeList = require('./sidebar/Knowledge/react.js');
const CSSKnowledgeList = require('./sidebar/Knowledge/css.js');
const BrowserKnowledgeList = require('./sidebar/Knowledge/browser.js');
const ToolsKnowledgeList = require('./sidebar/Knowledge/tools.js');
const ProjectCaseList = require('./sidebar/Knowledge/project-case.js');
// ---Quiz (快速問答測驗)---
const QuizJavaScriptList = require('./sidebar/Quiz/quiz-javascript.js');
const QuizSecurityList = require('./sidebar/Quiz/security.js');
// ---Coding (手寫程式實現)---
const LodashFunctionsList = require('./sidebar/Coding/lodash-functions.js');
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
    JavaScriptKnowledgeList,
    VueKnowledgeList,
    ReactKnowledgeList,
    CSSKnowledgeList,
    HttpKnowledgeList,
    BrowserKnowledgeList,
    ToolsKnowledgeList,
    ProjectCaseList,
    {
      type: 'category',
      label: '📝 Quiz 測驗',
      collapsible: true,
      collapsed: true,
      items: [QuizJavaScriptList, QuizSecurityList],
    },
  ],
  Coding: ['Coding/coding', LodashFunctionsList],
  LeetCode: ['LeetCode/leet-code', LeetCodeEasyList],
  Experience: ['Experience/experience', ExperienceList],
  AI: ['AI/ai-index', AIPromptsList],
  ShowCase: ['ShowCase/showcase', ChatifyList],
};
