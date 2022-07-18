import { ICommand } from '../../../Typings';
import { buildServer } from '../../../utils/BuildServer/buildServer';

const defaultExport: ICommand = {
	name: 'build_server',
	description: 'You could build your server structure using YAML file syntax.',
	permissions: ['Administrator', 'ManageChannels'],
	async execute({ interaction }) {
		await interaction.reply({ content: 'Building Server...', ephemeral: true });
		await buildServer(interaction);
	},
};

export default defaultExport;
