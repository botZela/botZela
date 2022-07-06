import { CategoryChannel, GuildBasedChannel } from 'discord.js';
import { client } from '../../..';
import { ICommand } from '../../../Typings';

export default {
	name: 'delete_category',
	description: 'Delete the whole category and its sub channels.',
	options: [
		{
			name: 'category',
			description: 'The category',
			type: 'CHANNEL',
			required: true,
		},
	],
	guilds: [
		client.testGuilds.find((guild) => guild.name.includes('TEST'))?.id ?? '',
		client.testGuilds.find((guild) => guild.name.includes('Test_channel'))?.id ?? '',
	],
	permissions: ['ADMINISTRATOR'],
	async execute({ interaction }) {
		const category = interaction.options.getChannel('category') as GuildBasedChannel;
		await interaction.deferReply({ ephemeral: true });
		if (!(category instanceof CategoryChannel)) {
			return interaction.followUp('Please select a category');
		}
		category.children.forEach((child) => {
			if (child.deletable) {
				child.delete().catch(console.error);
			}
		});
		await category.delete();
		await interaction.followUp({
			content: 'Deleted the Category Successfully.',
			ephemeral: true,
		});
	},
} as ICommand;
