import { GuildMember, Interaction, MessageEmbed } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedContextMenuInteraction } from '../../Typings';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'ContextMenuInteraction',
	async execute(interaction: Interaction): Promise<void> {
		if (!interaction.isContextMenu()) return;
		const member = interaction.member as GuildMember;

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
			if (command.permissions && !command.permissions.some((perm) => member.permissions.has(perm))) {
				await interaction.reply({
					content: "Sorry you can't use this Command/Button.",
					ephemeral: true,
				});
			} else {
				await command.execute({
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
	},
};

export default defaultExport;
