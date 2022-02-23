const { createDictStructure } = require("./createDictStructure");

async function batchCreate(client,guild,channelFormat){
    for (let format of channelFormat){
        await createDictStructure(client,guild,format);
    }
}

module.exports = {
    batchCreate,
}