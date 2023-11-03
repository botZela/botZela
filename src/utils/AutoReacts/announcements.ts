import type { Message } from 'discord.js';
import { client } from '../..';

export async function announcements(message: Message) {
	const SUPPORTED_GUILDS = client.testGuilds.map((guild) => guild.id);
	if (message.guildId && SUPPORTED_GUILDS.includes(message.guildId)) {
		const emojis = ['👍', '👎'];
		for (const emoji of emojis) {
			await message.react(emoji);
		}
	}
}
