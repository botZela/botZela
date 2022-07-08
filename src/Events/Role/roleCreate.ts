import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';
import { logsMessage } from '../../utils/logsMessage';

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
		const log = `[INFO] ${role.name} has been created.`;
		await logsMessage(log, role.guild);
	},
};

export default defaultExport;
