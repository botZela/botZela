const { createChannel } = require("./createChannel");
const data = require("../data/data.json");
const { saveData } = require("./saveData");
const { MessageEmbed } = require("discord.js");

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
    let embed = new MessageEmbed()
        .setColor(0xF02E1C)
        .setTitle("Please Setup the BOT")
        .setFooter({text : "Bot developed by WHAT'S N3XT TEAM."});
    await channel.send({embed:[embed]});
}

module.exports = {
    createCommandsChannel,
}