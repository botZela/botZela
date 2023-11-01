import { ZodError } from 'zod';
import type { ChannelListType, ChannelType, StructureListType, StructureType } from '../../Typings/buildServer';
import { zCategoryType, zChannelType } from '../../Typings/buildServer/index.js';

export function dictToList(structure: StructureType[]) {
	const ll: StructureListType[] = [];
	let tt: StructureListType;
	let name;
	let temp;
	let channels: ChannelType[];
	let subTypeElement;
	for (let format of structure) {
		try {
			format = zCategoryType.parse(format);
			name = format.category[0].split(',')[0];
			tt = [name, 'category'];
			try {
				channels = format.category[1].channels;
				tt[2] = dictToList(channels) as ChannelListType[];
				ll.push(tt);
			} catch {}

			continue;
		} catch (error) {
			if (error instanceof ZodError) {
				// Console.error('This is not a Category.');
			} else {
				console.error(error);
			}
		}

		try {
			format = zChannelType.parse(format);
			temp = format.channel.split(/,\s*/).slice(0, 2);
			name = temp[0];
			subTypeElement = temp[1] as 'forum' | 'stage' | 'text' | 'voice';
			tt = [name, 'channel', subTypeElement];
			ll.push(tt);
		} catch (error) {
			if (error instanceof ZodError) {
				// Console.error('This is not a Channel.');
			} else {
				console.error(error);
			}
		}
	}

	return ll;
}
