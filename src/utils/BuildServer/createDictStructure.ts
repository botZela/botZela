import { channel } from 'diagnostics_channel';
import { CategoryChannelResolvable, Guild, OverwriteResolvable } from 'discord.js';
import { ZodError } from 'zod';
import { ChannelType, StructureType, zCategoryType, zChannelType } from '../../Typings/buildServer';
import { createCategory } from '../Channels/createCategory';
import { createChannel } from '../Channels/createChannel';
import { createOverwrites } from './createOverwrites';

export async function createDictStructure(
	guild: Guild,
	format: StructureType,
	category?: CategoryChannelResolvable,
	overwrites?: OverwriteResolvable[],
): Promise<void> {
	let name: string = '',
		rolesList: string[],
		overwritesList: OverwriteResolvable[] = [],
		channels: ChannelType[],
		channelArg: string,
		type: 'text' | 'voice' | 'stage',
		categoryDict;
	try {
		format = zCategoryType.parse(format);
		categoryDict = format.category;
		try {
			let tempArray = categoryDict[0]
				.split(',')
				.filter((e) => e.length !== 0)
				.map((e) => e.trim());
			name = tempArray[0];
			rolesList = tempArray.slice(1);
			overwritesList = await createOverwrites(guild, rolesList);
		} catch (e) {
			null;
		}
		category = await createCategory(guild, name, overwritesList);
		try {
			channels = categoryDict[1].channels;
			for (let channel of channels) {
				await createDictStructure(guild, channel, category, overwritesList);
			}
		} catch (e) {
			null;
		}
		return;
	} catch (e) {
		if (e instanceof ZodError) {
			// console.error('This is not a Category.');
		} else console.error(e);
	}

	try {
		format = zChannelType.parse(format);
		channelArg = format.channel;
		try {
			let tempArray = channelArg
				.split(',')
				.filter((e) => e.length !== 0)
				.map((e) => e.trim());
			name = tempArray[0];
			type = tempArray[1] as 'text' | 'voice' | 'stage';
			rolesList = tempArray.slice(2);
			let channelOverwrites = await createOverwrites(guild, rolesList);
			overwritesList = overwrites ? channelOverwrites.concat(overwrites) : channelOverwrites;
			await createChannel(guild, name, type, category, overwritesList);
		} catch (e) {
			console.log(`[INFO] roles was not set for the channel ${name} in guild ${guild.name}`);
		}
	} catch (e) {
		if (e instanceof ZodError) {
			// console.error('This is not a Channel.');
		} else console.error(e);
	}
}
