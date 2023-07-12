import type { Guild } from 'discord.js';
import type { StructureType } from '../../Typings/buildServer';
import { createDictStructure } from './createDictStructure.js';

export async function batchCreate(guild: Guild, channelFormat: StructureType[]): Promise<void> {
	for (const format of channelFormat) {
		await createDictStructure(guild, format);
	}
}
