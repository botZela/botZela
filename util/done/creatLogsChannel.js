const { createChannel } = require("./createChannel");
const data = require("../../data/data.json");
const { saveData } = require("./saveData");

function createLogsChannel(client, guild, overwrites = null,category = null){
    if (!overwrites){
        //overwrites = {}
    }
    logs = await createChannel(client,guild,"『🤖』ensias-bot-logs","GUILD_TEXT",undefined,category)
    try{
        data["CHANNELS"][`${guild.id}`]['LOGS'] = logs.id;
    } catch(e){
        data["CHANNELS"][`${guild.id}`]['LOGS'] = {};
        data["CHANNELS"][`${guild.id}`]['LOGS'] = logs.id;
        saveData();
    }
}