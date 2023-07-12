import process from 'node:process';
import type { TextChannel } from 'discord.js';
import { client } from '../../index.js';
import { createErrorEmbed } from '../Embeds/index.js';

export const errors = () => {
	process.on(`uncaughtException`, async (error: Error) => {
		console.error(error);
		const channel = client.channels.cache.get('996922159173742673') as TextChannel;
		try {
			await channel.send({ embeds: [createErrorEmbed(error.name, error.message)] });
		} catch (error) {
			console.error(error);
		}
	});
};
