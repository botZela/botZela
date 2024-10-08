import type { Guild, OverwriteResolvable } from 'discord.js';
import { ChannelType } from 'discord.js';
import { logsEmbed } from '../Logger';

export async function createCategory(
	guild: Guild,
	name: string,
	overwrites?: OverwriteResolvable[],
	position?: number,
) {
	let message = `${name} category: `;
	try {
		const out = await guild.channels.create({
			name,
			type: ChannelType.GuildCategory,
			permissionOverwrites: overwrites,
			position,
		});
		message += `${out.toString()} Was Created Succesfully.`;
		await logsEmbed(message, guild, 'info');
		return out;
	} catch (error) {
		message += 'Was not created.';
		console.log(error);
		await logsEmbed(message, guild, 'error');
		return undefined;
	}
}
