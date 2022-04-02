const { saveData } = require(`${process.cwd()}/utils/saveData`);
const data = require(`${process.cwd()}/data/data.json`);
const { logsMessage } = require(`${process.cwd()}/utils/logsMessage`);
module.exports = {
    name: 'roleDelete',
    async execute(client, role) {
        try {
            delete data["ROLES"][`${role.guild.id}`][`${role.name}`];
            saveData();
            console.log(`[INFO] ${role.name} has been deleted.`);
            let log = `[INFO] ${role.name} has been deleted.`;
            await logsMessage(client, log, role.guild);
        } catch (e) {
            console.log(` [INFO] ${role.name} was not in data.`);
            let log = `[INFO] ${role.name} was not in data.`;
            await logsMessage(client, log, role.guild);
        }
    },
}