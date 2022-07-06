import { ZodError } from 'zod';
import {
	ChannelListType,
	ChannelType,
	StructureListType,
	StructureType,
	zCategoryType,
	zChannelType,
} from '../../Typings/buildServer';

export function dictToList(structure: StructureType[]) {
	const l: StructureListType[] = [];
	let t: StructureListType;
	let name;
	let temp;
	let channels: ChannelType[];
	let subTypeElement;
	for (let format of structure) {
		try {
			format = zCategoryType.parse(format);
			name = format.category[0].split(',')[0];
			t = [name, 'category'];
			try {
				channels = format.category[1].channels;
				t[2] = dictToList(channels) as ChannelListType[];
				l.push(t);
			} catch (e) {
				null;
			}
			continue;
		} catch (e) {
			if (e instanceof ZodError) {
				// Console.error('This is not a Category.');
			} else {
				console.error(e);
			}
		}
		try {
			format = zChannelType.parse(format);
			temp = format.channel.split(',').slice(0, 2);
			name = temp[0];
			subTypeElement = temp[1] as 'voice' | 'text' | 'stage';
			t = [name, 'channel', subTypeElement];
			l.push(t);
		} catch (e) {
			if (e instanceof ZodError) {
				// Console.error('This is not a Channel.');
			} else {
				console.error(e);
			}
		}
	}
	return l;
}
