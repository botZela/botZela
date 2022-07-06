import gRoles from '../../Models/guildRoles';
import { Event } from '../../Structures';
import { setupLogsCommandsChannels } from '../../utils/Command&LogsChannels';

const defaultExport: Event<'guildCreate'> = {
	name: 'guildCreate',
	async execute(guild): Promise<void> {
		console.log(`[INFO] Joined server : ${guild.name}`);
		const roles = await guild.roles.fetch();

		const guildData = await gRoles.findOne({ guildId: guild.id });

		const roleObj = new Map<string, string>();

		roles.forEach((role) => {
			roleObj.set(role.name, role.id);
		});

		if (guildData) {
			guildData.roles = roleObj;
			await guildData.save();
		} else {
			await gRoles.create({
				guildId: guild.id,
				guildName: guild.name,
				roles: roleObj,
			});
		}
		await setupLogsCommandsChannels(guild);
	},
};

export default defaultExport;
