import type { Guild, GuildMember, TextChannel } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { client } from '../..';
import gChannels from '../../Models/guildChannels';

type logsType = 'error' | 'info' | 'other' | 'warn';
const embedColors = {
	info: 'Green',
	error: 'Red',
	warn: 'Orange',
	other: 'Blue',
} as const;

export async function logsEmbed(message: string, guild: Guild, type: logsType, member?: GuildMember): Promise<void> {
	console.log(
		`[${type.toUpperCase()}][${guild.name}] ${message
			.replaceAll('%user%', member?.user.tag ?? 'user')
			.replaceAll('\n', `\n[${type.toUpperCase()}][${guild.name}] `)}`,
	);

	const embed = new EmbedBuilder({
		author: {
			name: member?.user.tag ?? client.user?.tag ?? '',
			iconURL: member?.displayAvatarURL() ?? client.user?.displayAvatarURL(),
		},
		description: `**${message.replaceAll('%user%', member?.toString() ?? '')}**`,
		footer: {
			text: member ? `ID: ${member.id}` : '',
		},
	})
		.setTimestamp()
		.setColor(embedColors[type]);

	try {
		const guildChannels = (await gChannels.findOne({ guildId: guild.id }))?.channels;
		if (!guildChannels) {
			console.log(`[ERROR] Logs channel not set in ${guild.name}`);
			return;
		}

		const logsId = guildChannels.get('LOGS');
		if (!logsId) {
			console.log(`[ERROR] Logs channel not set in ${guild.name}`);
			return;
		}

		const logsChannel = client.channels.cache.get(logsId) as TextChannel;
		await logsChannel.send({
			embeds: [embed],
		});
	} catch {
		console.log(`[ERROR] Logs channel not set in ${guild.name}`);
	}

	const infoChannel = client.channels.cache.get('1000544634046521416') as TextChannel;
	embed.setTitle(`${guild.name}`).setThumbnail(guild.iconURL());
	try {
		await infoChannel.send({ embeds: [embed] });
	} catch (error) {
		console.error(error);
	}
}
