const { logsMessage } = require("./logsMessage");

async function createChannel(client,guild,name,channel_type = "GUILD_TEXT",overwrites = null,category = null,position = null){
    let message = `[INFO] .${channel_type}_channel : .${name} in guild : .${guild.name}`;
    try{
        let out = await guild.channels.create(name,{
            type : channel_type,
            permissionOverwrites: overwrites,
        })
        out.setPosition(position);
        out.setParent(category);
        message = message+" Was Created Succesfully.";
        console.log(message);
        logsMessage(client,message,guild);
        return out;
    }catch(e){
        console.log(e);
        message = message+"Was not created";
        console.log(message);
        logsMessage(client,message,guild);
        return null;
    }
}

module.exports = {
    createChannel,
}
