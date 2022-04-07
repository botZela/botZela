const { saveData } = require(`${process.cwd()}/src/utils/saveData.js`);
const { logsMessage } = require(`${process.cwd()}/src/utils/logsMessage.js`);
module.exports = {
    name: 'roleCreate',
    async execute(client, role) {
        client.data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
        saveData(client.data);
        let log = `[INFO] ${role.name} has been created.`;
        await logsMessage(client, log, role.guild);
    },
}