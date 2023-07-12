import type { TextChannel } from 'discord.js';
import type { Event } from '../../Structures';
import { client } from '../../index.js';
import { createErrorEmbed } from '../../utils/index.js';

const defaultExport: Event<'error'> = {
	name: 'error',
	execute: async (error) => {
		console.error(error);
		const channel = client.channels.cache.get('996922159173742673') as TextChannel;
		await channel.send({ embeds: [createErrorEmbed(error.name, `\`\`\`${error.message}\`\`\``)] }).catch(console.error);
	},
};

export default defaultExport;
