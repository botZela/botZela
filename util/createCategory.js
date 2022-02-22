const { logsMessage } = require("./logsMessage");

async function createCategory(guild,name,overwrites = null,channelPosition = null){
    message = `[INFO] .${name} category in guild : .${guild.name} `
    try{
        out = await guild.channels.create(name,{
            type : "GUILD_CATEGORY",
        })
        out.setParent(category);
        message = message+" Was Created Succesfully.";
        console.log(message);
        logsMessage(client,message,guild);
        return out;
    }catch(e){
        message = message+"Was not created.";
        console.log(message);
        logsMessage(client,message,guild);
        return null;
    }
}

module.exports = {
    createCategory,
}
