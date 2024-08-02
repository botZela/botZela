import type { ModalActionRowComponentBuilder } from 'discord.js';
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import type { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'migrate_roles',
	description: 'Change Roles for multiple members at once',
	defaultMemberPermissions: ['Administrator', 'ManageRoles'],
	async execute({ interaction }) {
		const { options } = interaction;
		const modal = new ModalBuilder().setCustomId('migrating_roles').setTitle('Migrating Roles');

		// Add components to modal

		const placeholder = `
- id: "<user_id>"
  remove_roles: role1, role2
  add_roles: role3
`;

		const roleFormat = new TextInputBuilder()
			.setCustomId('role_format')
			.setLabel('Insert the List of members to change')
			.setValue(placeholder)
			// Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(roleFormat);

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	},
};

export default defaultExport;
