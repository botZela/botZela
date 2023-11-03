import type { CommandInteractionOptionResolver, Interaction } from 'discord.js';
import { client } from '../..';
import type { Event } from '../../Structures';
import type { ExtendedCommandInteraction } from '../../Typings';
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
			if (interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
				});
			} else if (interaction.replied) {
				await interaction.editReply({
					content: 'There was an error while executing this command!',
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}

			throw error;
		}
	},
};

export default defaultExport;
