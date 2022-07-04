import { ZodError } from 'zod';
import {
	StructureType,
	zCategoryType,
	zChannelType,
	StructureListType,
	ChannelListType,
	ChannelType,
} from '../../Typings/buildServer';

export function dictToList(structure: StructureType[]) {
	let l: StructureListType[] = [];
	let t: StructureListType;
	let name, temp, channels: ChannelType[], subTypeElement, typeELement;
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
				// console.error('This is not a Category.');
			} else console.error(e);
		}
		try {
			format = zChannelType.parse(format);
			typeELement = 'channel';
			temp = format.channel.split(',').slice(0, 2);
			name = temp[0];
			subTypeElement = temp[1] as 'voice' | 'text' | 'stage';
			t = [name, 'channel', subTypeElement];
			l.push(t);
		} catch (e) {
			if (e instanceof ZodError) {
				// console.error('This is not a Channel.');
			} else console.error(e);
		}
	}
	return l;
}
