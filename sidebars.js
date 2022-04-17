// Slip-Box
const LayoutList = require('./sidebar/SlipBox/LayoutList');
const VariableList = require('./sidebar/SlipBox/VariableList');
const DOMList = require('./sidebar/SlipBox/DOMList');
const AsyncList = require('./sidebar/SlipBox/AsyncList');
const NetworkList = require('./sidebar/SlipBox/NetworkList');
const BrowserList = require('./sidebar/SlipBox/BrowserList');
const ToolsList = require('./sidebar/SlipBox/ToolsList');

// Basics
const LeetCodeList = require('./sidebar/Basics/LeetCodeList');

// Read
const HistoryList = require('./sidebar/Read/HistoryList');
const ProgramsList = require('./sidebar/Read/ProgramsList');

module.exports = {
  SlipBox: [
    'SlipBox/slip-box-notes',
    LayoutList,
    VariableList,
    DOMList,
    AsyncList,
    NetworkList,
    BrowserList,
    ToolsList,
  ],
  Read: ['Read/summary', HistoryList, ProgramsList],
};
