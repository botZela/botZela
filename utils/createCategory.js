const { logsMessage } = require("./logsMessage.js");

async function createCategory(client, guild, name, overwrites = null, position = null) {
    let message = `[INFO] .${name} category in guild : .${guild.name} `
    try {
        let out = await guild.channels.create(name, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: overwrites,
        })
        out.setPosition(position);
        message = message + " Was Created Succesfully.";
        console.log(message);
        await logsMessage(client, message, guild);
        return out;
    } catch (e) {
        message = message + "Was not created.";
        console.log(message);
        console.log(e);
        await logsMessage(client, message, guild);
        return null;
    }
}

module.exports = {
    createCategory,
}