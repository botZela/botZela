const { logsMessage } = require("../logsMessage");

async function createChannel(
    client,
    guild,
    name,
    channel_type = "text",
    overwrites = null,
    category = null,
    position = null
) {
    let message = `[INFO] .${channel_type}_channel : .${name} in guild : .${guild.name}`;
    let types = { text: "GUILD_TEXT", voice: "GUILD_VOICE", stage: "GUILD_STAGE_VOICE" };
    try {
        let out = await guild.channels.create(name, {
            type: types[channel_type],
            permissionOverwrites: overwrites,
        });
        out.setPosition(position);
        out.setParent(category);
        message = message + " Was Created Succesfully.";
        logsMessage(client, message, guild);
        return out;
    } catch (e) {
        message = message + " Was not created";
        logsMessage(client, message, guild);
        return null;
    }
}

module.exports = {
    createChannel,
}