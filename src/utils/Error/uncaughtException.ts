import { TextChannel } from 'discord.js';
import { client } from '../..';

export const errors = () => {
	process.on(`uncaughtException`, (error) => {
		console.error(error);
		const channel = client.channels.cache.get('996922159173742673') as TextChannel;
		// channel.send(`\`\`\`\n${error.message}\n${error.name}\n\`\`\``).catch(console.error);
		channel
			.send({
				embeds: [
					{
						color: 'RED',
						title: error.name,
						description: error.message,
					},
				],
			})
			.catch(console.error);
	});
};
