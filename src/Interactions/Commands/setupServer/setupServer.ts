import type { ICommand } from '../../../Typings';
import { setupServer } from '../../../utils/SetupServer/setupServer';

const defaultExport: ICommand = {
	name: 'setup_server',
	description: 'Setup the server with SpreadSheet',
	defaultMemberPermissions: ['Administrator', 'ManageRoles'],
	async execute({ interaction }) {
		await interaction.reply({ content: 'Setuping Server...', ephemeral: true });
		await setupServer(interaction);
	},
};

export default defaultExport;
