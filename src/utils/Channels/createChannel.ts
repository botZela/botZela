import { CategoryChannelResolvable, ChannelType, Guild, OverwriteResolvable } from 'discord.js';
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
		text: ChannelType.GuildText,
		voice: ChannelType.GuildVoice,
		stage: ChannelType.GuildStageVoice,
	};
	try {
		const out = await guild.channels.create({
			name,
			type: types[channelType] as ChannelType.GuildText | ChannelType.GuildVoice | ChannelType.GuildStageVoice,
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
