const { logsChannel } = require("./logsMessage");

async function createRole(client, guild, name) {
    try {
        let role = await guild.roles.create({
            name: name,
        });
        let message = `[INFO] Role .${role.name} Created Succesfully in guild`;
        console.log(message + ` in guild ${guild.name}`);
        logsMessage(client, message, guild);
    } catch (e) {
        message = `[INFO] Failed to create Role ${name}`;
        console.log(message + ` in guild ${guild.name}`);
        logsMessage(client, message, guild);
    }
}

module.exports = {
    createRole,
}