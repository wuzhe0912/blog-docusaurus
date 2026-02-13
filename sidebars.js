// ---Knowledge (深度概念講解)---
const HttpKnowledgeList = require('./sidebar/Knowledge/http.js');
const BrowserKnowledgeList = require('./sidebar/Knowledge/browser.js');
const ToolsKnowledgeList = require('./sidebar/Knowledge/tools.js');
// ---Quiz (快速問答測驗)---
const QuizJavaScriptList = require('./sidebar/Quiz/quiz-javascript.js');
const QuizTypeScriptList = require('./sidebar/Quiz/quiz-typescript.js');
const QuizReactList = require('./sidebar/Quiz/quiz-react.js');
const QuizVueList = require('./sidebar/Quiz/quiz-vue.js');
const QuizCSSList = require('./sidebar/Quiz/quiz-css.js');
const QuizSecurityList = require('./sidebar/Quiz/security.js');
// ---Experience (面試經驗)---
const ExperienceList = require('./sidebar/Experience/experience.js');
// ---Coding (手寫程式實現)---
const LodashFunctionsList = require('./sidebar/Coding/lodash-functions.js');
const JavaScriptList = require('./sidebar/Coding/javascript.js');
// ---LeetCode (演算法題)---
const LeetCodeEasyList = require('./sidebar/LeetCodeQuestions/leet-code-easy.js');
// ---AI---
const AIPromptsList = require('./sidebar/AI/prompts.js');

module.exports = {
  Notes: [
    'Knowledge/knowledge',
    {
      type: 'category',
      label: '🌐 Browser & Network',
      items: [HttpKnowledgeList, BrowserKnowledgeList],
    },
    {
      type: 'category',
      label: '📒 JavaScript Ecosystem',
      items: [QuizJavaScriptList, QuizTypeScriptList],
    },
    {
      type: 'category',
      label: '⚛️ Frontend Frameworks',
      items: [QuizReactList, QuizVueList],
    },
    {
      type: 'category',
      label: '🎨 CSS & UI',
      items: [QuizCSSList],
    },
    {
      type: 'category',
      label: '🛡️ Web Security',
      items: [QuizSecurityList],
    },
    {
      type: 'category',
      label: '🛠️ Engineering & Tools',
      items: [ToolsKnowledgeList],
    },
    {
      type: 'category',
      label: '💼 Experience',
      items: ['Experience/2025-11-interview-prep', ExperienceList],
    },
    {
      type: 'category',
      label: '⌨️ Coding',
      items: ['Coding/coding', LodashFunctionsList, JavaScriptList],
    },
    {
      type: 'category',
      label: '📊 LeetCode',
      items: ['LeetCode/leet-code', LeetCodeEasyList],
    },
    {
      type: 'category',
      label: '🤖 AI',
      items: ['AI/ai-index', AIPromptsList],
    },
  ],
};
