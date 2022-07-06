import { CategoryChannelResolvable, Guild, OverwriteResolvable } from 'discord.js';
import { logsMessage } from '../logsMessage';

export async function createChannel(
	guild: Guild,
	name: string,
	channelType: 'text' | 'voice' | 'stage' = 'text',
	category?: CategoryChannelResolvable,
	overwrites?: OverwriteResolvable[],
	position?: number,
) {
	let message = `[INFO] .${channelType}_channel : .${name} in guild : .${guild.name}`;
	const types = {
		text: 'GUILD_TEXT',
		voice: 'GUILD_VOICE',
		stage: 'GUILD_STAGE_VOICE',
	};
	try {
		const out = await guild.channels.create(name, {
			type: types[channelType] as 'GUILD_TEXT' | 'GUILD_VOICE' | 'GUILD_STAGE_VOICE',
			permissionOverwrites: overwrites,
			position,
			parent: category,
		});
		message += ' Was Created Succesfully.';
		await logsMessage(message, guild);
		return out;
	} catch (e) {
		console.log(e);
		message += ' Was not created';
		await logsMessage(message, guild);
		return undefined;
	}
}
