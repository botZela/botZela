import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';
import { logsMessage } from '../../utils';

export default {
	name: 'roleUpdate',
	async execute(oldRole, newRole) {
		if (oldRole.name === newRole.name) return;
		const guildData = await gRoles.findOne({ guildId: newRole.guild.id });
		if (!guildData) {
			const log = `[ERROR] Could not find the guild in DB.`;
			return logsMessage(log, oldRole.guild);
		}
		try {
			guildData.roles.delete(`${oldRole.name}`);
			guildData.roles.set(`${newRole.name}`, newRole.id);
			await guildData.save();
			const log = `[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`;
			await logsMessage(log, newRole.guild);
			return;
		} catch (e) {
			guildData.roles.set(`${newRole.name}`, newRole.id);
			await guildData.save();
			const log = `[INFO] ${oldRole.name} role was not in data.`;
			await logsMessage(log, oldRole.guild);
		}
	},
} as Event<'roleUpdate'>;
