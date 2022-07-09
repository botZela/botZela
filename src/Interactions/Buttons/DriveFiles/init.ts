import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { client } from '../../..';
import guildDrive from '../../../Models/guildDrive';
import { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';
import { driveFilesSelectMenuOptions } from '../../../utils/DriveFiles/makeSelectMenuOption';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-init',
	// permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const driveData = await guildDrive.findOne({ messageId: interaction.message.id });

		if (!driveData) {
			return interaction.followUp({ content: 'Could not find the drive that you clicked on', ephemeral: true });
		}
		const { driveId: folderId, driveName: folderName } = driveData;
		client.gdFolderStack.set(interaction.member.id, []);
		client.gdFolderStack.get(interaction.member.id)!.push({ id: folderId, name: folderName });

		const options = await driveFilesSelectMenuOptions(folderId);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, 'This Folder is Empty.').addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: false });
			return;
		}

		const panelEmbed = createEmbed(
			`Get Files `,
			`📁 [${folderName}](https://drive.google.com/drive/folders/${folderId})\nThe easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('drivefiles-menu').setPlaceholder('Select a folder: ').addOptions(options),
			),
			new MessageActionRow().addComponents(
				new MessageButton({ customId: 'button-drivefiles-back', label: 'Back', style: 'SECONDARY', emoji: '⬅' }),
				new MessageButton({
					style: 'LINK',
					url: `https://drive.google.com/drive/folders/${folderId}`,
					label: 'View Folder',
					emoji: '',
				}),
			),
		];

		await interaction.followUp({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
