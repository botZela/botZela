const { Perms } = require("../Validation/PermissionNames");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Command Loaded");
    let commandsArray = [];

    let commandsFiles = await PG(`${process.cwd()}/commands/*/*.js`);
    for (let file of commandsFiles) {
        const command = require(file);
        if(!command.name) {
            Table.addRow(file.split("/").at(-1),"🟠 FAILED","Missing a name.");
            continue;
        }
        if(!command.context && !command.description) {
            Table.addRow(command.name,"🟠 FAILED","Missing a description.");
            continue;
        }
        if (command.permissions) {
            if(command.permissions.every((perm) => Perms.includes(perm))){
                command.defaulPermission = false;
            } else {
                Table.addRow(command.name,"🟠 FAILED","Permissions are invalid.");
                continue;
            }
        }

        client.commands.set(command.name,command);
        commandsArray.push(command);
        await Table.addRow(command.name,"🔵 SUCCESSFUL");

    }

    console.log(Table.toString());

    // Permissions Check //
    
    client.on("ready", async () => {
        for (let guildId of client.testGuilds){
            const guild = await client.guilds.cache.get(guildId);
            const Roles = (commandName) => {
                const cmdPerms = commandsArray.find((c) => c.name === commandName).permissions;
                if (!cmdPerms) return null;
                return guild.roles.cache.filter((r) => cmdPerms.some((perm) => r.permissions.has(perm)));
            }
            const command = await guild.commands.set(commandsArray);
            const fullPermissions = command.reduce((acc, r) => {
                const roles = Roles(r.name);
                if (!roles) return acc;

                const permissions = roles.reduce((a, r) => {
                    return [...a, { id: r.id, type: "ROLE", permission: true }]
                }, []);

                return [...acc, { id: r.id, permissions }];
            }, []);
            await guild.commands.permissions.set({ fullPermissions });
        }
    });

}