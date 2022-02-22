const { createChannel } = require("./createChannel");
const data = require("../../data/data.json");
const { saveData } = require("./saveData");

function createLogsChannel(client, guild, overwrites = null,category = null){
    if (!overwrites){
        //overwrites = {}
    }
    logs = await createChannel(client,guild,"『🤖』ensias-bot-commands","GUILD_TEXT",undefined,category)
    try{
        data["CHANNELS"][`${guild.id}`]['COMMANDS'] = logs.id;
    } catch(e){
        data["CHANNELS"][`${guild.id}`]['COMMANDS'] = {};
        data["CHANNELS"][`${guild.id}`]['COMMANDS'] = logs.id;
        saveData();
    }
}