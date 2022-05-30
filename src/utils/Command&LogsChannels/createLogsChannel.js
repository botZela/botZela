const { createChannel } = require("../Channels/createChannel");
const { saveData } = require("../saveData");

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
    logs = await createChannel(client,guild,"『🤖』botZela-logs","text",overwrites,category)
    try{
        client.data["CHANNELS"][`${guild.id}`]['LOGS'] = logs.id;
    } catch(e){
        console.error(e);
        client.data["CHANNELS"][`${guild.id}`] = {};
        client.data["CHANNELS"][`${guild.id}`]['LOGS'] = logs.id;
    }
    saveData(client.data);
}

module.exports = {
    createLogsChannel,
}