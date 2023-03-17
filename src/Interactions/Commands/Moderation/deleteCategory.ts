import { ApplicationCommandOptionType, CategoryChannel, ChannelType } from 'discord.js';
import { client } from '../../..';
import type { ICommand } from '../../../Typings';

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
		await interaction.deferReply({ ephemeral: true });
		const category = interaction.options.getChannel<ChannelType.GuildCategory>('category');
		if (!(category instanceof CategoryChannel)) {
			return interaction.followUp('Please select a category');
		}

		let check = true;

		for (const child of category.children.cache.values()) {
			if (child.deletable)
				try {
					const messages = await child.messages.fetch();
					if (messages.size === 0) {
						await child.delete();
					} else {
						check = false;
					}
				} catch (error) {
					console.error(error);
					check = false;
				}
		}

		if (check) await category.delete();
		await interaction.followUp({
			content: 'Deleted the Category Successfully.',
			ephemeral: true,
		});
	},
};

export default defaultExport;
