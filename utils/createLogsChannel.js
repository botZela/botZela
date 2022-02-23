const { createChannel } = require("./createChannel");
const data = require("../data/data.json");
const { saveData } = require("./saveData");

async function createLogsChannel(client, guild, overwrites = null,category = null){
    if (!overwrites){
        overwrites = [
            {
                id : guild.roles.everyone.id,
                deny :["VIEW_CHANNEL"],
            },
            {
                id: client.user.id,
                allow: ['VIEW_CHANNEL'],
            }
        ] 
    }
    logs = await createChannel(client,guild,"『🤖』ensias-bot-logs","GUILD_TEXT",overwrites,category)
    try{
        data["CHANNELS"][`${guild.id}`]['LOGS'] = logs.id;
    } catch(e){
        console.log(e);
        data["CHANNELS"][`${guild.id}`]['LOGS'] = logs.id;
    }
    saveData();
}

module.exports = {
    createLogsChannel,
}