import type { IModalSubmitCommand } from '../../../Typings';
import { convertYaml2RoleType, migrateRole } from '../../../utils/Roles/migrating.js';

const defaultExport: IModalSubmitCommand = {
	id: 'migrating_roles',
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		const roles_format = interaction.fields.getTextInputValue('role_format');

		if (!interaction.guild) {
			await interaction.reply({
				content: 'can not run this modal outside a server',
				ephemeral: true,
			});
			return;
		}

		try {
			const rolesFormat = convertYaml2RoleType(roles_format);
			if (rolesFormat !== 0) {
				await migrateRole(interaction.guild, rolesFormat);
			}

			await interaction.reply({
				content: 'Roles are updated succefully',
				ephemeral: true,
			});
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "Couldn't update the Roles for the Members",
				ephemeral: true,
			});
		}
	},
};

export default defaultExport;
