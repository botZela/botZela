import type { CategoryChannelResolvable, Guild, OverwriteResolvable } from 'discord.js';
import { ChannelType } from 'discord.js';
import { logsEmbed } from '../Logger/index.js';

export async function createChannel(
	guild: Guild,
	name: string,
	channelType: 'stage' | 'text' | 'voice' = 'text',
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
			type: types[channelType] as ChannelType.GuildStageVoice | ChannelType.GuildText | ChannelType.GuildVoice,
			permissionOverwrites: overwrites,
			position,
			parent: category,
		});
		message += `<#${out.id}> Was Created Succesfully.`;
		await logsEmbed(message, guild, 'info');
		return out;
	} catch (error) {
		console.log(error);
		message += ' Was not created';
		await logsEmbed(message, guild, 'error');
		return undefined;
	}
}
