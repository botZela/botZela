import type { CommandInteractionOptionResolver, Interaction } from 'discord.js';
import type { Event } from '../../Structures';
import type { ExtendedCommandInteraction } from '../../Typings';
import { client } from '../../index.js';
import { createErrorEmbed } from '../../utils/index.js';

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
