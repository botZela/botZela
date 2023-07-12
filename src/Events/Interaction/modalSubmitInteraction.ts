import type { GuildMember, Interaction } from 'discord.js';
import { InteractionType } from 'discord.js';
import type { Event } from '../../Structures';
import type { ExtendedModalSubmitInteraction } from '../../Typings';
import { client } from '../../index.js';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'ModalSubmitInteraction',
	async execute(interaction: Interaction) {
		if (interaction.type !== InteractionType.ModalSubmit) return;
		const { customId, guild } = interaction;
		const member = interaction.member as GuildMember;

		const modal = client.modalSubmits.get(customId);

		if (!modal) {
			await interaction.reply({ content: 'this Modal is not handled for now.', ephemeral: true });
			return;
		}

		if (modal.defaultMemberPermissions && !member.permissions.any(modal.defaultMemberPermissions)) {
			await interaction.reply({ content: 'You are missing Permissions.', ephemeral: true });
			return;
		}

		if (modal.ownerOnly && member.id !== guild?.ownerId) {
			await interaction.reply({ content: 'You are not the owner.', ephemeral: true });
			return;
		}

		await modal.execute({
			interaction: interaction as ExtendedModalSubmitInteraction,
		});
	},
};

export default defaultExport;
