const { logsMessage } = require("../logsMessage");

async function createChannel(client,guild,name,channel_type,overwrites = null,category = null,channelPosition = null){
    message = `[INFO] .${channel_type}_channel : .${name} in guild : .${guild.name}`
    try{
        out = await guild.channels.create(name,{
            type : channel_type,
        })
        out.setParent(category);
        message = message+" Was Created Succesfully.";
        console.log(message);
        logsMessage(client,message,guild);
        return out;
    }catch(e){
        message = message+"Was not created";
        console.log(message);
        logsMessage(client,message,guild);
        return null;
    }
}

module.exports = {
    createChannel,
}
