import { Guild, OverwriteResolvable } from 'discord.js';
import { createCommandsChannel } from './createCommandsChannel';
import { createLogsChannel } from './createLogsChannel';
import { client } from '../..';
import { createCategory } from '../Channels/createCategory';

export async function setupLogsCommandsChannels(guild: Guild) {
	const overwrites: OverwriteResolvable[] = [
		{
			id: guild.roles.everyone.id,
			deny: ['VIEW_CHANNEL'],
		},
	];
	if (client.user) {
		overwrites.push({
			id: client.user.id,
			allow: ['VIEW_CHANNEL'],
		});
	}
	const category = await createCategory(guild, '🦖 • botZela ▬▬▬▬▬▬▬▬▬▬▬▬', overwrites, 0);
	await createLogsChannel(guild, overwrites, category);
	await createCommandsChannel(guild, overwrites, category);
}