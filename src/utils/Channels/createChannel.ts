import { CategoryChannelResolvable, Guild, OverwriteResolvable } from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';
import { logsMessage } from '../logsMessage';

export async function createChannel(
	guild: Guild,
	name: string,
	channel_type: 'text' | 'voice' | 'stage' = 'text',
	category?: CategoryChannelResolvable,
	overwrites?: OverwriteResolvable[],
	position?: number,
) {
	let message = `[INFO] .${channel_type}_channel : .${name} in guild : .${guild.name}`;
	const types = {
		text: 'GUILD_TEXT',
		voice: 'GUILD_VOICE',
		stage: 'GUILD_STAGE_VOICE',
	};
	try {
		let out = await guild.channels.create(name, {
			type: types[channel_type] as 'GUILD_TEXT' | 'GUILD_VOICE' | 'GUILD_STAGE_VOICE',
			permissionOverwrites: overwrites,
			position,
			parent: category,
		});
		message = message + ' Was Created Succesfully.';
		logsMessage(message, guild);
		return out;
	} catch (e) {
		message = message + ' Was not created';
		logsMessage(message, guild);
		return undefined;
	}
}
