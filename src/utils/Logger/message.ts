import type { Guild, TextChannel } from 'discord.js';
import gChannels from '../../Models/guildChannels.js';
import { client } from '../../index.js';
import { createInfoEmbed } from '../Embeds/index.js';

export async function logsMessage(message: string, guild: Guild): Promise<void> {
	console.log(message);
	const infoChannel = client.channels.cache.get('1000544634046521416') as TextChannel;
	await infoChannel.send({ embeds: [createInfoEmbed('', `**${message}**`)] }).catch(console.error);
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

		const channel = client.channels.cache.get(logsId) as TextChannel;
		await channel.send(`\`\`\`css\n${message}\n\`\`\``);
	} catch {
		console.log(`[ERROR] Logs channel not set in ${guild.name}`);
	}
}
