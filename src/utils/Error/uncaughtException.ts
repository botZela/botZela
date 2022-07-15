import { TextChannel } from 'discord.js';
import { client } from '../..';
import { createErrorEmbed } from '../Embeds';

export const errors = () => {
	process.on(`uncaughtException`, (error) => {
		console.error(error);
		const channel = client.channels.cache.get('996922159173742673') as TextChannel;
		channel.send({ embeds: [createErrorEmbed(error.name, error.message)] }).catch(console.error);
	});
};
