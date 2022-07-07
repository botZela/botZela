import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { driveSearch, getParent } from '../../../OtherModules/GDrive';
import { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-back',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		await getParent('1cBafKG94MJsgR9Khceo6Jpr0f73CWTfZ');

		const options = (await driveSearch('1YxhLTBKOtj_hcjWa8ZYslGg88JJUiwBD'))
			?.map((file) => {
				if (file.name && file.id) {
					const output: MessageSelectOptionData = {
						label: file.name,
						value: file.id,
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
