import { ApplicationCommandOptionType } from 'discord.js';
import type { ICommand } from '../../../Typings';
import { buildServer } from '../../../utils/BuildServer/buildServer.js';
// import { buildServerFromFile } from '../../../utils/BuildServer/buildServerFile';

const defaultExport: ICommand = {
	name: 'build_server',
	description: 'You could build your server structure using YAML file syntax.',
	defaultMemberPermissions: ['Administrator', 'ManageChannels'],
	async execute({ interaction }) {
		await interaction.reply({ content: 'Building Server...', ephemeral: true });
		await buildServer(interaction);
	},
};

export default defaultExport;
