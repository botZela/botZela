import { createChannel } from '../Channels/createChannel';
import gChannels from '../../Models/guildChannels';
import { client } from '../..';
import { CategoryChannelResolvable, Guild, OverwriteResolvable, TextChannel } from 'discord.js';

export async function createLogsChannel(
	guild: Guild,
	overwrites?: OverwriteResolvable[],
	category?: CategoryChannelResolvable,
) {
	if (!overwrites && client.user) {
		overwrites = [
			{
				id: guild.roles.everyone.id,
				deny: ['VIEW_CHANNEL'],
			},
			{
				id: client.user.id,
				allow: ['VIEW_CHANNEL'],
			},
		];
	}
	const logs = (await createChannel(guild, '『🤖』botZela-logs', 'text', category, overwrites)) as TextChannel;

	const guildData = await gChannels.findOne({ guildId: guild.id });

	if (guildData) {
		guildData.channels.set('LOGS', logs.id);
		guildData.save();
	} else {
		gChannels.create({
			guildId: guild.id,
			guildName: guild.name,
			channels: {
				LOGS: logs.id,
			},
		});
	}
}
