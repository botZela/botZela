import gRoles from '../../Models/guildRoles.js';
import type { Event } from '../../Structures';
import { logsEmbed } from '../../utils/index.js';

const defaultExport: Event<'roleUpdate'> = {
	name: 'roleUpdate',
	async execute(oldRole, newRole) {
		if (oldRole.name === newRole.name) return;
		const guildData = await gRoles.findOne({ guildId: newRole.guild.id });
		if (!guildData) {
			const log = `Could not find the guild in DB.`;
			return logsEmbed(log, oldRole.guild, 'error');
		}

		try {
			guildData.roles.delete(`${oldRole.name}`);
			guildData.roles.set(`${newRole.name}`, newRole.id);
			await guildData.save();
			const log = `${oldRole.toString()} role name changed from ${oldRole.name} to ${newRole.name}.`;
			await logsEmbed(log, newRole.guild, 'info');
		} catch {
			guildData.roles.set(`${newRole.name}`, newRole.id);
			await guildData.save();
			const log = `${oldRole.name} role was not in data.`;
			await logsEmbed(log, oldRole.guild, 'info');
		}
	},
};

export default defaultExport;
