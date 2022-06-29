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
	category: [string, { channels: ChannelType[] }];

	constructor(inputObj: unknown) {
		if (Object.keys(inputObj)[0] !== 'category') throw "Can't Create CategoryClass from this object";
		this.category = Object.values(inputObj)[0];
		if (!Array.isArray(this.category)) throw "Can't Create CategoryClass from this object";
		this.category;
	}
}

export class ChannelClass implements ChannelType {
	channel: string;
}

export type StructureType = CategoryClass | ChannelClass;

export type ChannelListType = [string, 'channel', 'text' | 'voice' | 'stage'];
export type CategoryListType = [string, 'category', ChannelListType[]?];

export type StructureListType = ChannelListType | CategoryListType;
