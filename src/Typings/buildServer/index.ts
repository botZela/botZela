import { GenericTypeGuard, GenericValidator } from 'runtime-typescript-checker';

export type ChannelType = {
	channel: string;
};
export type CategoryType = {
	category: [
		string,
		{
			channels: ChannelType[];
		},
	];
};
export class CategoryClass implements CategoryType {
	// category: [string, { channels: ChannelType[] }];

	constructor(inputObj: unknown) {
		if (Object.keys(inputObj)[0] !== 'category') throw "Can't Create CategoryClass from this object";
		this.category = Object.values(inputObj)[0];
		if (!Array.isArray(this.category)) throw "Can't Create CategoryClass from this object";
		this.category;
	}
}

function isCategoryClass(iCandidate: unknown): boolean {
	return true;
}

export class ChannelClass implements ChannelType {
	channel: string;
}

export type StructureType = CategoryClass | ChannelClass;

export type ChannelListType = [string, 'channel', 'text' | 'voice' | 'stage'];
export type CategoryListType = [string, 'category', ChannelListType[]?];

export type StructureListType = ChannelListType | CategoryListType;

// export function ValidateStructureType(iCandidate: unknown): ReturnType<typeof GenericValidator> {
// 	return GenericValidator('StructureType', iCandidate);
// }

// export function isStructureType(iCandidate: unknown): iCandidate is StructureType {
// 	return GenericTypeGuard('StructureType', iCandidate);
// }