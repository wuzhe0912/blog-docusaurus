// Slip-Box
// -- interview --
const InterviewList = require('./sidebar/SlipBox/InterviewList');
// -- Layout & styles --
const CSSWorldList = require('./sidebar/SlipBox/CSSWorldList');
const LayoutList = require('./sidebar/SlipBox/LayoutList');
// -- programming languages --
const BuildEnvironmentList = require('./sidebar/SlipBox/BuildEnvironmentList');
const VariableList = require('./sidebar/SlipBox/VariableList');
const SyntaxList = require('./sidebar/SlipBox/SyntaxList');
const ES6PlusList = require('./sidebar/SlipBox/ES6PlusList');
// -- browser --
const NetworkList = require('./sidebar/SlipBox/NetworkList');
const BrowserList = require('./sidebar/SlipBox/BrowserList');
const ToolsList = require('./sidebar/SlipBox/ToolsList');

// Components
const VanillaJSList = require('./sidebar/Components/VanillaJSList');

// Read
const HistoryList = require('./sidebar/Read/HistoryList');
const ProgramsList = require('./sidebar/Read/ProgramsList');

module.exports = {
  SlipBox: [
    'SlipBox/slip-box-notes',
    // -- interview --
    InterviewList,
    // -- Layout & styles --
    CSSWorldList,
    LayoutList,
    // -- programming languages --
    BuildEnvironmentList,
    VariableList,
    SyntaxList,
    ES6PlusList,
    // -- browser --
    NetworkList,
    BrowserList,
    // -- tools --
    ToolsList,
  ],
  Components: ['Components/components-list', VanillaJSList],
  Read: ['Read/read-list', HistoryList, ProgramsList],
};
