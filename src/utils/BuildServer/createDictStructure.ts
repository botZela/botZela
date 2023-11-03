import type { CategoryChannelResolvable, Guild, OverwriteResolvable } from 'discord.js';
import { ZodError } from 'zod';
import type { ChannelType, ForumType, StructureType } from '../../Typings/buildServer';
import { zCategoryType, zChannelType, zForumType } from '../../Typings/buildServer';
import { createCategory } from '../Channels/createCategory';
import { createChannel } from '../Channels/createChannel';
import { createOverwrites } from './createOverwrites';

export async function createDictStructure(
	guild: Guild,
	format_param: StructureType,
	category_param?: CategoryChannelResolvable,
	overwrites?: OverwriteResolvable[],
): Promise<void> {
	let name = '';
	let rolesList: string[];
	let overwritesList: OverwriteResolvable[] = [];
	let channels: (ChannelType | ForumType)[];
	let channelArg: string;
	let type: 'forum' | 'stage' | 'text' | 'voice';
	let categoryDict;
	let format = format_param;
	let category = category_param;
	try {
		format = zCategoryType.parse(format);
		categoryDict = format.category;
		try {
			const tempArray = categoryDict[0]
				.split(',')
				.filter((ee) => ee.length !== 0)
				.map((ee) => ee.trim());
			name = tempArray[0];
			rolesList = tempArray.slice(1);
			overwritesList = await createOverwrites(guild, rolesList, true);
		} catch (error) {
			console.error(error);
		}

		category = await createCategory(guild, name, overwritesList);
		try {
			channels = categoryDict[1].channels;
			for (const channel of channels) {
				await createDictStructure(guild, channel, category, overwritesList);
			}
		} catch (error) {
			console.error(error);
		}

		return;
	} catch (error) {
		if (error instanceof ZodError) {
			// Console.error('This is not a Category.');
		} else {
			console.error(error);
		}
	}

	try {
		format = zChannelType.parse(format);
		channelArg = format.channel;
		try {
			const tempArray = channelArg
				.split(',')
				.filter((ee) => ee.length !== 0)
				.map((ee) => ee.trim());
			name = tempArray[0];
			type = tempArray[1] as 'stage' | 'text' | 'voice';
			rolesList = tempArray.slice(2);
			const channelOverwrites = await createOverwrites(guild, rolesList, true);
			overwritesList = overwrites ? channelOverwrites.concat(overwrites) : channelOverwrites;
			await createChannel(guild, name, type, category, overwritesList);
		} catch {
			console.log(`[INFO] roles was not set for the channel ${name} in guild ${guild.name}`);
		}
	} catch (error) {
		if (error instanceof ZodError) {
			// Console.error('This is not a Channel.');
		} else {
			console.error(error);
		}
	}

	try {
		format = zForumType.parse(format);
		channelArg = format.forum[0];
		try {
			const tempArray = channelArg
				.split(',')
				.filter((ee) => ee.length !== 0)
				.map((ee) => ee.trim());
			[name, ...rolesList] = tempArray;
			const channelOverwrites = await createOverwrites(guild, rolesList, true);
			overwritesList = overwrites ? channelOverwrites.concat(overwrites) : channelOverwrites;

			const tags = format.forum[1]?.tags ?? [];
			await createChannel(guild, name, 'forum', category, overwritesList, undefined, tags);
		} catch {
			console.log(`[INFO] roles was not set for the channel ${name} in guild ${guild.name}`);
		}
	} catch (error) {
		if (error instanceof ZodError) {
			// Console.error('This is not a Channel.');
		} else {
			console.error(error);
		}
	}
}
