import { GuildMember, Interaction } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedModalSubmitInteraction } from '../../Typings';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'ModalSubmitInteraction',
	async execute(interaction: Interaction) {
		if (!interaction.isModalSubmit()) return;
		const { customId, guild } = interaction;
		const member = interaction.member as GuildMember;

		const modal = client.modalSubmits.get(customId);

		if (!modal) {
			return interaction.reply({ content: 'this Modal is not handled for now.', ephemeral: true });
		}

		if (modal.permissions && !modal.permissions.some((perm) => member.permissions.has(perm))) {
			return interaction.reply({ content: 'You are missing permissions.', ephemeral: true });
		}

		if (modal.ownerOnly && member.id !== guild?.ownerId) {
			return interaction.reply({ content: 'You are not the owner.', ephemeral: true });
		}

		await modal.execute({
			interaction: interaction as ExtendedModalSubmitInteraction,
		});
	},
};

export default defaultExport;
