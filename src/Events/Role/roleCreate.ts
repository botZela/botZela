import { logsMessage } from '../../utils/logsMessage';
import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';

export default {
	name: 'roleCreate',
	async execute(role): Promise<void> {
		const guildData = await gRoles.findOne({ guildId: role.guild.id });
		guildData.roles.set(`${role.name}`, role.id);
		await guildData.save();
		let log = `[INFO] ${role.name} has been created.`;
		await logsMessage(log, role.guild);
	},
} as Event<'roleCreate'>;
