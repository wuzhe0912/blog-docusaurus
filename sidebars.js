/**
 * Creating a sidebar enables you to:
  - create an ordered group of docs
  - render a sidebar for each doc of that group
  - provide next/previous navigation

  The sidebars can be generated from the filesystem, or explicitly defined here.

  Create as many sidebars as you want.
*/

const JavaScriptList = require('./sidebar/JavaScriptList');
const ES6PlusList = require('./sidebar/ES6PlusList');
const NodeList = require('./sidebar/NodeList');
const PHPList = require('./sidebar/PHPList');
const Day30List = require('./sidebar/2021iThomeList');
const TypeScriptList = require('./sidebar/TypeScriptList');
const NextList = require('./sidebar/React/NextList');

module.exports = {
  Frontend: [
    'Frontend/frontend-intro',
    JavaScriptList,
    ES6PlusList,
    TypeScriptList,
    NextList,
  ],
  Backend: ['01-backend-intro', PHPList, NodeList],
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
  Day30: ['day30-intro', Day30List],
};
