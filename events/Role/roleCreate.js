const { saveData } = require(`${process.cwd()}/utils/saveData.js`);
const data = require(`${process.cwd()}/data/data.json`);
const { logsMessage } = require(`${process.cwd()}/utils/logsMessage.js`);
module.exports = {
    name: 'roleCreate',
    async execute(client, role) {
        data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
        saveData();
        console.log(`[INFO] ${role.name} has been created.`);
        let log = `[INFO] ${role.name} has been created.`;
        await logsMessage(client, log, role.guild);
    },
}