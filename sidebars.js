/**
 * Creating a sidebar enables you to:
  - create an ordered group of docs
  - render a sidebar for each doc of that group
  - provide next/previous navigation

  The sidebars can be generated from the filesystem, or explicitly defined here.

  Create as many sidebars as you want.
*/

const JavaScriptList = require('./sidebar/JavaScriptList');
const ES6List = require('./sidebar/ES6List');
const NodeList = require('./sidebar/NodeList');
const PHPList = require('./sidebar/PHPList');

module.exports = {
  JavaScriptSidebar: [
    'js-intro',
    JavaScriptList,
    ES6List,
    NodeList
  ],
  PHPSidebar: [
    'php-intro',
    PHPList,
  ],
  PythonSidebar: [
    'python-intro',
    {
      type: 'category',
      label: 'Native',
      items: [
        'Python/Native/0-python-grammar',
      ]
    },
    {
      type: 'category',
      label: 'Selenium',
      items: [
        'Python/Selenium/0-install-selenium',
      ]
    }
  ],
  ToolSidebar: [
    'tools-intro',
    {
      type: 'category',
      label: 'Git',
      items: [
        'Tools/Git/0-git-install',
        'Tools/Git/1-command-line',
      ]
    }
  ]
};
