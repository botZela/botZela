import { client } from '../../..';
import { ICommand } from '../../../Typings';
import { buildServer } from '../../../utils/BuildServer/buildServer';

export default {
	name: 'build_server',
	description: 'You could build your server structure using YAML file syntax.',
	permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS'],
	async execute({ interaction }) {
		await interaction.reply({ content: 'Building Server...', ephemeral: true });
		await buildServer(client, interaction);
	},
} as ICommand;
