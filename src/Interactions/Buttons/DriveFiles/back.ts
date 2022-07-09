import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';
import { makeComponents, driveFilesSelectMenuOptions } from '../../../utils/DriveFiles';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-back',
	// permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferUpdate();

		if (!interaction.guild) {
			return interaction.editReply({ content: 'This command is used inside a server ...' });
		}
		const stack = client.gdFolderStack.get(interaction.member.id);
		if (stack && stack.length > 1) stack.pop();

		const folderId = stack?.at(-1)?.id ?? stack!.at(0)!.id;

		const options = await driveFilesSelectMenuOptions(folderId);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, 'This Folder is Empty.').addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);
			await interaction.editReply({ embeds: [errorEmbed] });
			return;
		}
		const path = client.gdFolderStack
			.get(interaction.member.id)!
			.map((x) => x.name)
			.join('/');
		const panelEmbed = createEmbed(
			`Get Files `,
			`📁 [${path}](https://drive.google.com/drive/folders/${folderId})\nThe easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = makeComponents(options, folderId);
		await interaction.editReply({ embeds: [panelEmbed], components });
	},
};

export default defaultExport;
