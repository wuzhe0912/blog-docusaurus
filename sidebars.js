// Basics
const CSSWorldList = require('./sidebar/Basics/CSSWorldList');
const JSBasicsList = require('./sidebar/Basics/JSBasicsList');
const NetworkList = require('./sidebar/Basics/NetworkList');
const BrowserList = require('./sidebar/Basics/BrowserList');
const ToolsList = require('./sidebar/Basics/ToolsList');
const LeetCodeList = require('./sidebar/Basics/LeetCodeList');

// Read
const HistoryList = require('./sidebar/Read/HistoryList');
const ProgramsList = require('./sidebar/Read/ProgramsList');

// Schedule
const ScramList = require('./sidebar/Schedule/ScramList');

module.exports = {
  Basics: [
    'Basics/collection',
    CSSWorldList,
    JSBasicsList,
    NetworkList,
    BrowserList,
    ToolsList,
    LeetCodeList,
  ],
  Read: ['Read/summary', HistoryList, ProgramsList],
  Schedule: [ScramList],
};
