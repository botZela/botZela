import { logsMessage } from '../../utils';
import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';

export default {
	name: 'roleUpdate',
	async execute(oldRole, newRole) {
		if (oldRole.name == newRole.name) return;
		let guildData;
		try {
			guildData = await gRoles.findOne({ guildId: newRole.guild.id });
		} catch (e) {
			let log = `[ERROR] Could not find the guild in DB.`;
			return await logsMessage(log, oldRole.guild);
		}

		try {
			guildData.roles.delete(`${oldRole.name}`);
			guildData.roles.set(`${newRole.name}`, newRole.id);
			await guildData.save();
			let log = `[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`;
			await logsMessage(log, newRole.guild);
			return;
		} catch (e) {
			guildData.roles.set(`${newRole.name}`, newRole.id);
			await guildData.save();
			let log = `[INFO] ${oldRole.name} role was not in data.`;
			await logsMessage(log, oldRole.guild);
		}
	},
} as Event<'roleUpdate'>;
