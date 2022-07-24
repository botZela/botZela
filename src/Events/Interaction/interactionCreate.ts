import { CommandInteractionOptionResolver, Interaction } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedCommandInteraction } from '../../Typings';
import { createErrorEmbed } from '../../utils';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'CommandInteraction',
	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) {
			await interaction.reply({
				embeds: [createErrorEmbed('', '⛔ An error occured while running this command.')],
			});
			return;
		}

		try {
			await command.execute({
				args: interaction.options as CommandInteractionOptionResolver,
				interaction: interaction as ExtendedCommandInteraction,
			});
		} catch (error) {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
			throw error;
		}
	},
};

export default defaultExport;
