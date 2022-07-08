import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';
import { driveFilesSelectMenuOptions } from '../../../utils/DriveFiles/makeSelectMenuOption';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-init',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const initialFolder = '1YxhLTBKOtj_hcjWa8ZYslGg88JJUiwBD';
		client.gdFolderStack.set(interaction.member.id, []);
		client.gdFolderStack.get(interaction.member.id)!.push({ id: initialFolder, name: 'ENSIAS' });

		const options = await driveFilesSelectMenuOptions(initialFolder);
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
			`📁 [ENSIAS](https://drive.google.com/drive/folders/${initialFolder})\nThe easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('drivefiles-menu').setPlaceholder('Select a folder: ').addOptions(options),
			),
		];

		await interaction.followUp({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
