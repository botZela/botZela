import { Guild, TextChannel } from 'discord.js';
import { client } from '..';
import gChannels from '../Models/guildChannels';

export async function logsMessage(message: string, guild: Guild): Promise<void> {
	console.log(message);
	try {
		const guildChannels = (await gChannels.findOne({ guildId: guild.id }))?.channels;
		if (!guildChannels) {
			return console.log(`[ERROR] Logs channel not set in ${guild.name}`);
		}
		const logsId = guildChannels.get('LOGS');
		if (!logsId) {
			console.log(`[ERROR] Logs channel not set in ${guild.name}`);
			return;
		}
		const channel = client.channels.cache.get(logsId) as TextChannel;
		await channel.send(`\`\`\`css\n${message}\n\`\`\``);
	} catch (e) {
		console.log(`[ERROR] Logs channel not set in ${guild.name}`);
	}
}
