import { CommandInteractionOptionResolver, MessageEmbed } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedCommandInteraction, ExtendedContextMenuInteraction } from '../../Typings';

export default {
	name: 'interactionCreate',
	alias: 'ContextMenuInteraction',
	async execute(interaction: ExtendedCommandInteraction): Promise<void> {
		if (interaction.isContextMenu()) {
			const command = client.contextMenuCommands.get(interaction.commandName);
			if (!command) {
				return interaction.reply({
					embeds: [
						new MessageEmbed({
							color: 'RED',
							description: '⛔ An error occured while running this command.',
						}),
					],
				});
			}

			try {
				if (command.permissions && !command.permissions.some((perm) => interaction.member.permissions.has(perm))) {
					await interaction.reply({
						content: "Sorry you can't use this Command/Button.",
						ephemeral: true,
					});
				} else {
					await command.execute({
						args: interaction.options as CommandInteractionOptionResolver,
						interaction: interaction as ExtendedContextMenuInteraction,
					});
				}
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		}
	},
} as Event<'interactionCreate'>;
