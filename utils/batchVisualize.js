const { batchCreateVisualization } = require("./batchCreateVisualization");
const { dictToList } = require("./dictToList");
const { structureSort } = require("./structureSort");

function batchVisualize(guild,channelFormat){
    let dictFormat = dictToList(channelFormat);
    structureSort(dictFormat);
    let visualization = batchCreateVisualization(dictFormat);
    return visualization; 
}

module.exports = {
    batchVisualize,
}