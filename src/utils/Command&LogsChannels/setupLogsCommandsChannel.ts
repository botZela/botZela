import type { Guild, OverwriteResolvable } from 'discord.js';
import { client } from '../../index.js';
import { createCategory } from '../Channels/createCategory.js';
import { createCommandsChannel } from './createCommandsChannel.js';
import { createLogsChannel } from './createLogsChannel.js';

export async function setupLogsCommandsChannels(guild: Guild) {
	const overwrites: OverwriteResolvable[] = [
		{
			id: guild.roles.everyone.id,
			deny: ['ViewChannel'],
		},
	];
	if (client.user) {
		overwrites.push({
			id: client.user.id,
			allow: ['ViewChannel'],
		});
	}

	const category = await createCategory(guild, '🦖 • botZela ▬▬▬▬▬▬▬▬▬▬▬▬', overwrites, 0);
	await createLogsChannel(guild, overwrites, category);
	await createCommandsChannel(guild, overwrites, category);
}
