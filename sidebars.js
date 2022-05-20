const FundamentalsList = require('./sidebar/SlipBox/FundamentalsList.js');
const TheBrowserList = require('./sidebar/SlipBox/TheBrowserList.js');
const ToolsList = require('./sidebar/SlipBox/ToolsList.js');
const BuildEnvironmentList = require('./sidebar/SlipBox/BuildEnvironmentList.js');

const RoadMapList = require('./sidebar/RoadMap/RoadMapList.js');
const InterviewList = require('./sidebar/RoadMap/InterviewList.js');

module.exports = {
  SlipBox: [
    'SlipBox/slip-box-notes',
    FundamentalsList,
    TheBrowserList,
    ToolsList,
    BuildEnvironmentList,
  ],
  RoadMap: ['RoadMap/road-map-notes', InterviewList, RoadMapList],
};
