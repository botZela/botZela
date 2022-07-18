import { ChannelType, Guild, OverwriteResolvable } from 'discord.js';
import { logsMessage } from '../logsMessage';

export async function createCategory(
	guild: Guild,
	name: string,
	overwrites?: OverwriteResolvable[],
	position?: number,
) {
	let message = `[INFO] .${name} category in guild : .${guild.name} `;
	try {
		const out = await guild.channels.create({
			name,
			type: ChannelType.GuildCategory,
			permissionOverwrites: overwrites,
			position,
		});
		message += ' Was Created Succesfully.';
		await logsMessage(message, guild);
		return out;
	} catch (e) {
		message += 'Was not created.';
		console.log(e);
		await logsMessage(message, guild);
		return undefined;
	}
}
