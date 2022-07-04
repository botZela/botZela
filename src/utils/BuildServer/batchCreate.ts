import { Guild } from 'discord.js';
import { StructureType } from '../../Typings/buildServer';
import { createDictStructure } from './createDictStructure';

export async function batchCreate(guild: Guild, channelFormat: StructureType[]): Promise<void> {
	for (let format of channelFormat) {
		await createDictStructure(guild, format);
	}
}
