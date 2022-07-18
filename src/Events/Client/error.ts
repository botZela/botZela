import { TextChannel } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { createErrorEmbed } from '../../utils';

const defaultExport: Event<'error'> = {
	name: 'error',
	execute: async (error) => {
		console.error(error);
		const channel = client.channels.cache.get('996922159173742673') as TextChannel;
		await channel.send({ embeds: [createErrorEmbed(error.name, `\`\`\`${error.message}\`\`\``)] }).catch(console.error);
	},
};

export default defaultExport;
