const { createChannel } = require("../Channels/createChannel");
const { createEmbed } = require("../createEmbed");
const gChannels = require("../../Models/guildChannels");

async function createCommandsChannel(client, guild, overwrites = null, category = null) {
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

    const guildData = await gChannels.findOne({ guildId: guild.id });

    if (guildData){
        guildData.channels.set('COMMANDS', cmds.id);
        guildData.save();
    } else {
        gChannels.create({
            guildId: guild.id,
            guildName: guild.name,
            channels: {
                COMMANDS: cmds.id,
            },
        });
    }

    let embed = createEmbed("Please Setup the BOT");
    await cmds.send({ embeds: [embed] });
}

module.exports = {
    createCommandsChannel,
}