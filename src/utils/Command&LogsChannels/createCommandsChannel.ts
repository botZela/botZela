import { createChannel } from '../Channels/createChannel';
import { createEmbed } from '../createEmbed';
import gChannels from '../../Models/guildChannels';
import { client } from '../..';
import { CategoryChannelResolvable, Guild, OverwriteResolvable, TextChannel } from 'discord.js';

export async function createCommandsChannel(
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
	const cmds = (await createChannel(guild, '『🤖』botZela-commands', 'text', category, overwrites)) as TextChannel;

	const guildData = await gChannels.findOne({ guildId: guild.id });

	if (guildData) {
		guildData.channels.set('COMMANDS', cmds.id);
		guildData.save();
	} else {
		gChannels.create({
			guildId: guild.id,
			guildName: guild.name,
			channels: {
				COMMANDS: cmds.id,
			},
		});
	}

	let embed = createEmbed('Please Setup the BOT');
	await cmds.send({ embeds: [embed] });
}
