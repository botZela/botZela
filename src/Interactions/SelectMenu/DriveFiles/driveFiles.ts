import { MessageActionRow, MessageButton, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { driveSearch } from '../../../OtherModules/GDrive';
import { ISelectMenuCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: ISelectMenuCommand = {
	id: 'drivefiles-menu',
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await interaction.deferUpdate();

		const { values } = interaction;

		const folder = values[0];

		const options = (await driveSearch(folder))
			?.map((file) => {
				if (file.name && file.mimeType && file.id) {
					const output: MessageSelectOptionData = {
						label: file.name,
						description: file.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File',
						value: file.id,
					};
					return output;
				}
				return undefined;
			})
			.filter((x): x is MessageSelectOptionData => x !== undefined);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, '__**Nothing Found!**__ ');
			await interaction.reply({ embeds: [errorEmbed], ephemeral: false });
			return;
		}
		const panelEmbed = createEmbed(`Get Files`, '__**Select a Folder**__ ');

		const components = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('drivefiles-menu').setPlaceholder('Select a folder: ').addOptions(options),
			),
			new MessageActionRow().addComponents(
				new MessageButton({ customId: 'button-drivefiles-back', label: 'Back', style: 'SECONDARY' }),
			),
		];

		await interaction.editReply({
			embeds: [panelEmbed],
			components: components,
		});
	},
};

export default defaultExport;
