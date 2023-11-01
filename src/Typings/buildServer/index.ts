import { z } from 'zod';

export const zChannelType = z
	.object({
		channel: z
			.string({
				// eslint-disable-next-line camelcase
				required_error: 'You need to insert Channel',
			})
			.regex(/.+,.+/),
	})
	.strict();

export const zCategoryType = z
	.object({
		category: z.tuple([
			z.string(),
			z.object({
				channels: z.array(zChannelType),
			}),
		]),
	})
	.strict();

export type ChannelType = z.infer<typeof zChannelType>;

export type CategoryType = z.infer<typeof zCategoryType>;

export const zStructureType = z.union([zCategoryType, zChannelType]);

export type StructureType = z.infer<typeof zStructureType>;

export type ChannelListType = [string, 'channel', 'forum' | 'stage' | 'text' | 'voice'];

export type CategoryListType = [string, 'category', ChannelListType[]?];

export type StructureListType = CategoryListType | ChannelListType;
