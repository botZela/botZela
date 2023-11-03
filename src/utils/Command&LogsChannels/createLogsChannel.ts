import type { CategoryChannelResolvable, Guild, OverwriteResolvable, TextChannel } from 'discord.js';
import { client } from '../..';
import gChannels from '../../Models/guildChannels';
import { createChannel } from '../Channels/createChannel';

export async function createLogsChannel(
	guild: Guild,
	overwrites_param?: OverwriteResolvable[],
	category?: CategoryChannelResolvable,
) {
	let overwrites = overwrites_param;

	if (!overwrites && client.user) {
		overwrites = [
			{
				id: guild.roles.everyone.id,
				deny: ['ViewChannel'],
			},
			{
				id: client.user.id,
				allow: ['ViewChannel'],
			},
		];
	}

	const logs = (await createChannel(guild, '『🤖』botZela-logs', 'text', category, overwrites)) as TextChannel;

	const guildData = await gChannels.findOne({ guildId: guild.id });

	if (guildData) {
		guildData.channels.set('LOGS', logs.id);
		await guildData.save();
	} else {
		await gChannels.create({
			guildId: guild.id,
			guildName: guild.name,
			channels: {
				LOGS: logs.id,
			},
		});
	}
}
