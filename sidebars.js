/**
 * Creating a sidebar enables you to:
  - create an ordered group of docs
  - render a sidebar for each doc of that group
  - provide next/previous navigation

  The sidebars can be generated from the filesystem, or explicitly defined here.

  Create as many sidebars as you want.
*/

const JavaScriptList = require('./sidebar/JavaScriptList');
const NodeList = require('./sidebar/NodeList');
const PHPList = require('./sidebar/PHPList');
const Day30List = require('./sidebar/2021iThomeList');

module.exports = {
  Frontend: [
    'frontend-intro',
    JavaScriptList,
  ],
  // JavaScriptSidebar: [
  //   'javascript-intro',
  //   NodeList
  // ],
  BackendSidebar: [
    'backend-intro',
    PHPList,
  ],
  // PythonSidebar: [
  //   'python-intro',
  //   {
  //     type: 'category',
  //     label: 'Native',
  //     items: [
  //       'Python/Native/0-python-grammar',
  //     ]
  //   },
  //   {
  //     type: 'category',
  //     label: 'Selenium',
  //     items: [
  //       'Python/Selenium/0-install-selenium',
  //     ]
  //   }
  // ],
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
  ],
  Day30Sidebar: [
    'day30-intro',
    Day30List,
  ]
};
