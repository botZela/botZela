const { createCategory } = require("../Channels/createCategory");
const { createCommandsChannel } = require("./createCommandsChannel");
const { createLogsChannel } = require("./createLogsChannel");

async function setupLogsCommandsChannels(client, guild) {
    let overwrites = [
        {
            id: guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"],
        },
        {
            id: client.user.id,
            allow: ["VIEW_CHANNEL"],
        },
    ];
    let category = await createCategory(
        client,
        guild,
        "🦖 • botZela ▬▬▬▬▬▬▬▬▬▬▬▬",
        overwrites,
        0
    );
    await createLogsChannel(client, guild, overwrites, category);
    await createCommandsChannel(client, guild, overwrites, category);
}

module.exports = {
    setupLogsCommandsChannels,
};
