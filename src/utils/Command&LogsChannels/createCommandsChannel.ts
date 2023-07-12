import type { CategoryChannelResolvable, Guild, OverwriteResolvable, TextChannel } from 'discord.js';
import gChannels from '../../Models/guildChannels.js';
import { client } from '../../index.js';
import { createChannel } from '../Channels/createChannel.js';
import { createEmbed } from '../Embeds/index.js';

export async function createCommandsChannel(
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

	const cmds = (await createChannel(guild, '『🤖』botZela-commands', 'text', category, overwrites)) as TextChannel;

	const guildData = await gChannels.findOne({ guildId: guild.id });

	if (guildData) {
		guildData.channels.set('COMMANDS', cmds.id);
		await guildData.save();
	} else {
		await gChannels.create({
			guildId: guild.id,
			guildName: guild.name,
			channels: {
				COMMANDS: cmds.id,
			},
		});
	}

	const embed = createEmbed('Please Setup the BOT');
	await cmds.send({ embeds: [embed] });
}
