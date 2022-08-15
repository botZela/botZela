import { CategoryChannelResolvable, ChannelType, Guild, OverwriteResolvable } from 'discord.js';
import { logsEmbed } from '../Logger';

export async function createChannel(
	guild: Guild,
	name: string,
	channelType: 'text' | 'voice' | 'stage' = 'text',
	category?: CategoryChannelResolvable,
	overwrites?: OverwriteResolvable[],
	position?: number,
) {
	let message = `__${channelType}_channel__ (${name}) : `;
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
		message += `<#${out.id}> Was Created Succesfully.`;
		await logsEmbed(message, guild, 'info');
		return out;
	} catch (e) {
		console.log(e);
		message += ' Was not created';
		await logsEmbed(message, guild, 'error');
		return undefined;
	}
}
