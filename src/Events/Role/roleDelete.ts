import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';
import { logsEmbed } from '../../utils';

const defaultExport: Event<'roleDelete'> = {
	name: 'roleDelete',
	async execute(role) {
		let log;
		try {
			const guildData = await gRoles.findOne({ guildId: role.guild.id });
			if (!guildData) {
				return;
			}
			guildData.roles.delete(`${role.name}`);
			await guildData.save();
			log = `${role.name} has been deleted.`;
		} catch (e) {
			log = `${role.name} was not in data.`;
		}
		await logsEmbed(log, role.guild, 'warn');
	},
};

export default defaultExport;
