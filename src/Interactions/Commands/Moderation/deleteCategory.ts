import { ApplicationCommandOptionType, CategoryChannel, ChannelType } from 'discord.js';
import type { ICommand } from '../../../Typings';
import { client } from '../../../index.js';

const defaultExport: ICommand = {
	name: 'delete_category',
	description: 'Delete the whole category and its sub channels.',
	options: [
		{
			name: 'category',
			description: 'The category',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildCategory],
			required: true,
		},
	],
	guilds: [
		client.testGuilds.find((guild) => guild.name.includes('TEST'))?.id ?? '',
		client.testGuilds.find((guild) => guild.name.includes('Test_channel'))?.id ?? '',
	],
	defaultMemberPermissions: ['Administrator'],
	async execute({ interaction }) {
		const category = interaction.options.getChannel('category')!;
		await interaction.deferReply({ ephemeral: true });
		if (!(category instanceof CategoryChannel)) {
			return interaction.followUp('Please select a category');
		}

		for (const child of category.children.cache.values()) {
			if (child.deletable)
				try {
					await child.delete();
				} catch (error) {
					console.error(error);
				}
		}

		await category.delete();
		await interaction.followUp({
			content: 'Deleted the Category Successfully.',
			ephemeral: true,
		});
	},
};

export default defaultExport;
