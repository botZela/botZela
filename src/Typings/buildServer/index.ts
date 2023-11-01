import { z } from 'zod';

export const zChannelType = z
	.object({
		channel: z
			.string({
				// eslint-disable-next-line camelcase
				required_error: 'You need to insert Channel',
			})
			.regex(/.+,\s*(?<type>voice|text|stage)(?<roles>\s*,.*)?$/),
	})
	.strict();

export const zForumType = z
	.object({
		forum: z.union([
			z.tuple([
				z.string(),
				z.object({
					tags: z.array(z.string()),
				}),
			]),
			z.tuple([z.string()]),
		]),
	})
	.strict();

export const zCategoryType = z
	.object({
		category: z.tuple([
			z.string(),
			z.object({
				channels: z.array(z.union([zChannelType, zForumType])),
			}),
		]),
	})
	.strict();

export type ChannelType = z.infer<typeof zChannelType>;

export type CategoryType = z.infer<typeof zCategoryType>;

export type ForumType = z.infer<typeof zForumType>;

export const zStructureType = z.union([zCategoryType, zChannelType, zForumType]);

export type StructureType = z.infer<typeof zStructureType>;

export type ChannelListType = [string, 'channel', 'stage' | 'text' | 'voice'];

export type CategoryListType = [string, 'category', ChannelListType[]?];

export type ForumListType = [string, 'channel', 'forum', string[]?];

export type StructureListType = CategoryListType | ChannelListType | ForumListType;
