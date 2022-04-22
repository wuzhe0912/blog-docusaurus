// Slip-Box
// -- Layout & styles --
const CSSWorldList = require('./sidebar/SlipBox/CSSWorldList');
const LayoutList = require('./sidebar/SlipBox/LayoutList');
// -- javascript --
const VariableList = require('./sidebar/SlipBox/VariableList');
const DOMList = require('./sidebar/SlipBox/DOMList');
const AsyncList = require('./sidebar/SlipBox/AsyncList');
const ES6PlusList = require('./sidebar/SlipBox/ES6PlusList');
// -- browser --
const NetworkList = require('./sidebar/SlipBox/NetworkList');
const BrowserList = require('./sidebar/SlipBox/BrowserList');
const ToolsList = require('./sidebar/SlipBox/ToolsList');
// -- interview --
const InterviewList = require('./sidebar/SlipBox/interview/InterviewList');
const LeetCodeList = require('./sidebar/SlipBox/interview/LeetCodeList');

// Components
const VanillaJSList = require('./sidebar/Components/VanillaJSList');

// Read
const HistoryList = require('./sidebar/Read/HistoryList');
const ProgramsList = require('./sidebar/Read/ProgramsList');

module.exports = {
  SlipBox: [
    'SlipBox/slip-box-notes',
    // -- Layout & styles --
    CSSWorldList,
    LayoutList,
    // -- javascript --
    VariableList,
    DOMList,
    AsyncList,
    ES6PlusList,
    // -- browser --
    NetworkList,
    BrowserList,
    // -- tools --
    ToolsList,
    // -- interview --
    InterviewList,
    LeetCodeList,
  ],
  Components: ['Components/components-list', VanillaJSList],
  Read: ['Read/read-list', HistoryList, ProgramsList],
};
