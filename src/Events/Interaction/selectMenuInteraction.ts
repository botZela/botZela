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

		const SelectMenu = client.selectMenu.get(customId);

		if (!SelectMenu) {
			return interaction.reply({ content: 'this `Select Menu` is not handle for now.', ephemeral: true });
		}

		if (SelectMenu.permissions && !SelectMenu.permissions.some((perm) => member.permissions.has(perm))) {
			return interaction.reply({ content: 'You are missing permissions.', ephemeral: true });
		}

		if (SelectMenu.ownerOnly && member.id !== guild?.ownerId) {
			return interaction.reply({ content: 'You are not the owner.', ephemeral: true });
		}

		await SelectMenu.execute({ interaction: interaction as ExtendedSelectMenuInteraction });
	},
};

export default defaultExport;
