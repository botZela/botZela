import { CommandInteractionOptionResolver, GuildMember, Interaction } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedCommandInteraction } from '../../Typings';
import { createErrorEmbed } from '../../utils';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'CommandInteraction',
	async execute(interaction: Interaction) {
		if (!interaction.isCommand()) return;
		const member = interaction.member as GuildMember;

		const command = client.commands.get(interaction.commandName);
		if (!command) {
			return interaction.reply({
				embeds: [createErrorEmbed('', '⛔ An error occured while running this command.')],
			});
		}

		try {
			if (command.permissions && !command.permissions.some((perm) => member.permissions.has(perm))) {
				await interaction.reply({
					content: "Sorry you can't use this Command.",
					ephemeral: true,
				});
			} else {
				await command.execute({
					args: interaction.options as CommandInteractionOptionResolver,
					interaction: interaction as ExtendedCommandInteraction,
				});
			}
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
