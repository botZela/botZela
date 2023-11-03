import type { GuildMember, Interaction } from 'discord.js';
import { client } from '../..';
import type { Event } from '../../Structures';
import type { ExtendedSelectMenuInteraction } from '../../Typings';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'SelectMenuInteraction',
	async execute(interaction: Interaction): Promise<void> {
		if (!interaction.isStringSelectMenu()) return;

		const { customId, guild } = interaction;
		const member = interaction.member as GuildMember;

		const SelectMenu = client.selectMenus.get(customId);

		if (!SelectMenu) {
			await interaction.reply({ content: 'this `Select Menu` is not handle for now.', ephemeral: true });
			return;
		}

		if (SelectMenu.defaultMemberPermissions && !member.permissions.any(SelectMenu.defaultMemberPermissions)) {
			await interaction.reply({ content: 'You are missing Permissions.', ephemeral: true });
			return;
		}

		if (SelectMenu.ownerOnly && member.id !== guild?.ownerId) {
			await interaction.reply({ content: 'You are not the owner.', ephemeral: true });
			return;
		}

		await SelectMenu.execute({ interaction: interaction as ExtendedSelectMenuInteraction });
	},
};

export default defaultExport;
