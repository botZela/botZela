const { createChannel } = require("./createChannel");
const data = require("../data/data.json");
const { saveData } = require("./saveData");
const { MessageEmbed } = require("discord.js");
const { createEmbed } = require("./createEmbed");

async function createCommandsChannel(client, guild, overwrites = null,category = null){
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
    logs = await createChannel(client,guild,"『🤖』ensias-bot-commands",undefined,overwrites,category)
    try{
        data["CHANNELS"][`${guild.id}`]['COMMANDS'] = logs.id;
    } catch(e){
        data["CHANNELS"][`${guild.id}`]['COMMANDS'] = {};
        data["CHANNELS"][`${guild.id}`]['COMMANDS'] = logs.id;
    }
    saveData();
    channel = client.channels.cache.get(CHANNELS[`${guild.id}`]['COMMANDS']);
    let embed = createEmbed("Please Setup the BOT");
    await channel.send({embeds:[embed]});
}

module.exports = {
    createCommandsChannel,
}