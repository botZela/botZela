import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';
import { logsMessage } from '../../utils';

const defaultExport: Event<'roleDelete'> = {
	name: 'roleDelete',
	async execute(role) {
		try {
			const guildData = await gRoles.findOne({ guildId: role.guild.id });
			if (!guildData) {
				return;
			}
			guildData.roles.delete(`${role.name}`);
			await guildData.save();
			const log = `[INFO] ${role.name} has been deleted.`;
			await logsMessage(log, role.guild);
		} catch (e) {
			const log = `[INFO] ${role.name} was not in data.`;
			await logsMessage(log, role.guild);
		}
	},
};

export default defaultExport;
