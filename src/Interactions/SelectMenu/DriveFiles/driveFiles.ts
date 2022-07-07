import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { client } from '../../..';
import { generatePublicUrl } from '../../../OtherModules/GDrive';
import { ISelectMenuCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';
import { driveFilesSelectMenuOptions } from '../../../utils/DriveFiles/makeSelectMenuOption';

const defaultExport: ISelectMenuCommand = {
	id: 'drivefiles-menu',
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await interaction.deferUpdate();

		const { values, component } = interaction;

		const fileId = values[0];
		const fileIndex = component.options.findIndex((x) => x.value === fileId);
		const fileDesc = component.options.at(fileIndex)?.description;
		const fileName = component.options.at(fileIndex)?.label;

		if (fileDesc && fileDesc === 'File') {
			const fileObj = await generatePublicUrl(fileId);
			let out = '';
			if (fileObj.webViewLink) out += `View File : ${fileObj.webViewLink}\n`;
			if (fileObj.webContentLink) out += `Download File : ${fileObj.webContentLink}\n`;
			await interaction.editReply({
				content: out,
				components: [],
				embeds: [],
			});
			return;
		}

		client.gdFolderStack.get(interaction.member.id)!.push({ id: fileId, name: fileName ?? '' });
		const path = client.gdFolderStack
			.get(interaction.member.id)!
			.map((x) => x.name)
			.join('/');

		const options = await driveFilesSelectMenuOptions(fileId);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, '__**Nothing Found!**__ ');
			await interaction.reply({ embeds: [errorEmbed], ephemeral: false });
			return;
		}
		const panelEmbed = createEmbed(`Get Files`, `__**${path}**__`);

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
