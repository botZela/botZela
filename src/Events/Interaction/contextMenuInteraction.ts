import { GuildMember, Interaction } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedContextMenuInteraction } from '../../Typings';
import { createErrorEmbed } from '../../utils';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'ContextMenuInteraction',
	async execute(interaction: Interaction): Promise<void> {
		if (!interaction.isContextMenuCommand()) return;
		const member = interaction.member as GuildMember;

		const command = client.contextMenuCommands.get(interaction.commandName);
		if (!command) {
			await interaction.reply({
				embeds: [createErrorEmbed('', '⛔ An error occured while running this command.')],
			});
			return;
		}

		try {
			if (command.defaultMemberPermissions && !member.permissions.any(command.defaultMemberPermissions)) {
				await interaction.reply({
					content: "Sorry you can't use this Command.",
					ephemeral: true,
				});
			} else {
				await command.execute({
					interaction: interaction as ExtendedContextMenuInteraction,
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
