import { MessageActionRow, MessageButton } from 'discord.js';
import { ICommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: ICommand = {
	name: 'drivefiles-panel',
	description: 'Get Drive Files',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferReply();

		if (!interaction.inGuild()) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const panelEmbed = createEmbed(`Get Files`, '__**to edit**__ ');

		const components = [
			new MessageActionRow().addComponents(
				new MessageButton().setCustomId('button-drivefiles-init').setLabel('get files').setStyle('PRIMARY'),
			),
		];
		await interaction.followUp({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
