import { GuildMember, Interaction } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedSelectMenuInteraction } from '../../Typings';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'SelectMenuInteraction',
	async execute(interaction: Interaction): Promise<void> {
		if (!interaction.isSelectMenu()) return;

		const { customId, guild } = interaction;
		const member = interaction.member as GuildMember;

		const SelectMenu = client.selectMenus.get(customId);

		if (!SelectMenu) {
			await interaction.reply({ content: 'this `Select Menu` is not handle for now.', ephemeral: true });
			return;
		}

		if (SelectMenu.permissions && !SelectMenu.permissions.some((perm) => member.permissions.has(perm))) {
			await interaction.reply({ content: 'You are missing permissions.', ephemeral: true });
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
