import { ICommand } from '../../../Typings';
import { setupServer } from '../../../utils/SetupServer/setupServer';

export default {
	name: 'setup_server',
	description: 'Setup the server with SpreadSheet',
	permissions: ['ADMINISTRATOR', 'MANAGE_ROLES'],
	async execute({ interaction }) {
		await interaction.reply({ content: 'Setuping Server...', ephemeral: true });
		await setupServer(interaction);
	},
} as ICommand;
