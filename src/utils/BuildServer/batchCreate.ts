import { Guild } from 'discord.js';
import { createDictStructure } from './createDictStructure';
import { StructureType } from '../../Typings/buildServer';

export async function batchCreate(guild: Guild, channelFormat: StructureType[]): Promise<void> {
	for (const format of channelFormat) {
		await createDictStructure(guild, format);
	}
}
