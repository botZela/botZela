import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { driveSearch } from '../../../OtherModules/GDrive';
import { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: IButtonCommand = {
	id: 'drivefiles-button',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });
		const { guild } = interaction;

		if (!guild || !guild.me) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const options = (await driveSearch('1YxhLTBKOtj_hcjWa8ZYslGg88JJUiwBD'))
			?.map((file) => {
				if (file.name && file.mimeType && file.id) {
					const output: MessageSelectOptionData = {
						label: file.name,
						value: file.id,
						description: file.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File',
					};
					return output;
				}
				return undefined;
			})
			.filter((x): x is MessageSelectOptionData => x !== undefined);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, '__**Nothing Found!**__ ');
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: false });
			return;
		}
		const panelEmbed = createEmbed(`Get Files`, '__**Select a Folder**__ ');

		const components = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('drivefiles-menu').setPlaceholder('Select a folder: ').addOptions(options),
			),
		];
		await interaction.followUp({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
