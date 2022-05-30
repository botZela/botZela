const { createChannel } = require("../Channels/createChannel");
const { saveData } = require("../saveData");
const { createEmbed } = require("../createEmbed");

async function createCommandsChannel(client, guild, overwrites = null, category = null) {
    const { CHANNELS } = client.data;
    if (!overwrites) {
        overwrites = [{
                id: guild.roles.everyone.id,
                deny: ["VIEW_CHANNEL"],
            },
            {
                id: client.user.id,
                allow: ['VIEW_CHANNEL'],
            }
        ]
    }
    cmds = await createChannel(client, guild, "『🤖』botZela-commands", "text", overwrites, category);
    if (!cmds) return;
    try {
        client.data["CHANNELS"][`${guild.id}`]['COMMANDS'] = cmds.id;
    } catch (e) {
        console.error(e);
        client.data["CHANNELS"][`${guild.id}`] = {};
        client.data["CHANNELS"][`${guild.id}`]['COMMANDS'] = cmds.id;
    }
    saveData(client.data);
    let embed = createEmbed("Please Setup the BOT");
    await cmds.send({ embeds: [embed] });
}

module.exports = {
    createCommandsChannel,
}