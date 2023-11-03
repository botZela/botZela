import type { CategoryChannelResolvable, Guild, OverwriteResolvable } from 'discord.js';
import { ChannelType, ForumChannel } from 'discord.js';
import { logsEmbed } from '../Logger';

export async function createChannel(
	guild: Guild,
	name: string,
	channelType: 'forum' | 'stage' | 'text' | 'voice' = 'text',
	category?: CategoryChannelResolvable,
	overwrites?: OverwriteResolvable[],
	position?: number,
	tags?: string[],
) {
	let message = `__${channelType}_channel__ (${name}) : `;
	const types = {
		text: ChannelType.GuildText,
		voice: ChannelType.GuildVoice,
		stage: ChannelType.GuildStageVoice,
		forum: ChannelType.GuildForum,
	};
	try {
		const out = await guild.channels.create({
			name,
			type: types[channelType] as
				| ChannelType.GuildForum
				| ChannelType.GuildStageVoice
				| ChannelType.GuildText
				| ChannelType.GuildVoice,
			permissionOverwrites: overwrites,
			position,
			parent: category,
		});
		if (out instanceof ForumChannel && tags) {
			await out.setAvailableTags(
				tags
					.map((tag) => tag.split(/\s*,\s*/).map((tag) => tag.trim()))
					.map((tag) =>
						tag.length === 2
							? { name: tag[0].slice(0, 20), emoji: { id: null, name: tag[1] } }
							: { name: tag[0].slice(0, 20) },
					),
			);
		}

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
