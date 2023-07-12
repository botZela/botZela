import { client } from '..';
import type { RegisterCommandsOptions } from '../Typings';

export async function registerCommands({ commands, guildId }: RegisterCommandsOptions) {
	if (guildId) {
		await client.guilds.cache.get(guildId)?.commands.set(commands);
		console.log(`Registering commands to ${client.guilds.cache.get(guildId)?.name ?? 'Unknown'}`);
	} else {
		await client.application?.commands.set(commands);
		console.log('Registering global commands');
	}
}
