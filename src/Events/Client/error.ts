import { TextChannel } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';

const defaultExport: Event<'error'> = {
	name: 'error',
	execute: async (error) => {
		console.error(error);
		const channel = client.channels.cache.get('935315424592166942') as TextChannel;
		await channel.send(`\`\`\`css\n${JSON.stringify(error)}\n\`\`\``);
	},
};

export default defaultExport;
