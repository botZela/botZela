import { logsMessage } from '../../utils';
import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';

export default {
	name: 'roleDelete',
	async execute(role) {
		try {
			const guildData = await gRoles.findOne({ guildId: role.guild.id });
			guildData.roles.delete(`${role.name}`);
			await guildData.save();
			let log = `[INFO] ${role.name} has been deleted.`;
			await logsMessage(log, role.guild);
		} catch (e) {
			let log = `[INFO] ${role.name} was not in data.`;
			await logsMessage(log, role.guild);
		}
	},
} as Event<'roleDelete'>;
