import gRoles from '../../Models/guildRoles.js';
import type { Event } from '../../Structures';
import { logsEmbed } from '../../utils/Logger/index.js';

const defaultExport: Event<'roleCreate'> = {
	name: 'roleCreate',
	async execute(role): Promise<void> {
		const guildData = await gRoles.findOne({ guildId: role.guild.id });
		if (guildData) {
			guildData.roles.set(role.name, role.id);
			await guildData.save();
		} else {
			const roleObj = JSON.parse(`{"${role.name}": "${role.id}"}`) as Map<string, string>;

			await gRoles.create({
				guildId: role.guild.id,
				guildName: role.guild.name,
				roles: roleObj,
			});
		}

		const log = `${role.name} has been created. (${role.toString()})`;
		await logsEmbed(log, role.guild, 'info');
	},
};

export default defaultExport;
