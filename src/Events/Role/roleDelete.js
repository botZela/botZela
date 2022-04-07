const { saveData } = require(`${process.cwd()}/src/utils/saveData`);
const { logsMessage } = require(`${process.cwd()}/src/utils/logsMessage`);
module.exports = {
    name: 'roleDelete',
    async execute(client, role) {
        try {
            delete client.data["ROLES"][`${role.guild.id}`][`${role.name}`];
            saveData(client.data);
            let log = `[INFO] ${role.name} has been deleted.`;
            await logsMessage(client, log, role.guild);
        } catch (e) {
            let log = `[INFO] ${role.name} was not in data.`;
            await logsMessage(client, log, role.guild);
        }
    },
}