import { Message } from 'discord.js';
import { client } from '../..';
import { choice } from '../';

export async function introduceYourSelf(message: Message) {
	const SUPPORTED_GUILDS = client.testGuilds.map((guild) => guild.id);
	if (SUPPORTED_GUILDS.includes(`${message.guildId}`)) {
		const emojis = ['💯', '🎊', '👍', '👋', '🎉', '✨', '🥳'];
		for (let i = 0; i < 3; i++) {
			let emoji = choice(emojis);
			await message.react(emoji);
			const index = emojis.indexOf(emoji);
			if (index > -1) {
				emojis.splice(index, 1);
			}
		}
	}
}