import { GuildMember, Interaction, InteractionType } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedModalSubmitInteraction } from '../../Typings';

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

		if (modal.permissions && !modal.permissions.some((perm) => member.permissions.has(perm))) {
			await interaction.reply({ content: 'You are missing permissions.', ephemeral: true });
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
