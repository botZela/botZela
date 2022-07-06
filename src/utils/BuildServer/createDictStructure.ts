import { CategoryChannelResolvable, Guild, OverwriteResolvable } from 'discord.js';
import { ZodError } from 'zod';
import { createOverwrites } from './createOverwrites';
import { ChannelType, StructureType, zCategoryType, zChannelType } from '../../Typings/buildServer';
import { createCategory } from '../Channels/createCategory';
import { createChannel } from '../Channels/createChannel';

export async function createDictStructure(
	guild: Guild,
	format: StructureType,
	category?: CategoryChannelResolvable,
	overwrites?: OverwriteResolvable[],
): Promise<void> {
	let name = '';
	let rolesList: string[];
	let overwritesList: OverwriteResolvable[] = [];
	let channels: ChannelType[];
	let channelArg: string;
	let type: 'text' | 'voice' | 'stage';
	let categoryDict;
	try {
		format = zCategoryType.parse(format);
		categoryDict = format.category;
		try {
			const tempArray = categoryDict[0]
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
			for (const channel of channels) {
				await createDictStructure(guild, channel, category, overwritesList);
			}
		} catch (e) {
			null;
		}
		return;
	} catch (e) {
		if (e instanceof ZodError) {
			// Console.error('This is not a Category.');
		} else {
			console.error(e);
		}
	}

	try {
		format = zChannelType.parse(format);
		channelArg = format.channel;
		try {
			const tempArray = channelArg
				.split(',')
				.filter((e) => e.length !== 0)
				.map((e) => e.trim());
			name = tempArray[0];
			type = tempArray[1] as 'text' | 'voice' | 'stage';
			rolesList = tempArray.slice(2);
			const channelOverwrites = await createOverwrites(guild, rolesList);
			overwritesList = overwrites ? channelOverwrites.concat(overwrites) : channelOverwrites;
			await createChannel(guild, name, type, category, overwritesList);
		} catch (e) {
			console.log(`[INFO] roles was not set for the channel ${name} in guild ${guild.name}`);
		}
	} catch (e) {
		if (e instanceof ZodError) {
			// Console.error('This is not a Channel.');
		} else {
			console.error(e);
		}
	}
}
