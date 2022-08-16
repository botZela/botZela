import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { createEmbed, createErrorEmbed } from '../../../utils';
import { makeComponents, driveFilesSelectMenuOptions } from '../../../utils/DriveFiles';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-back',

	execute: async ({ interaction }) => {
		await interaction.deferUpdate();

		if (!interaction.guild) {
			return interaction.editReply({ content: 'This command is used inside a server ...' });
		}
		const stack = client.gdFolderStack.get(interaction.member.id);
		if (!stack) {
			const embed = createErrorEmbed('Get Files', 'Use the button (__**Get Files**__) again.');
			return interaction.editReply({ embeds: [embed], components: [] });
		}

		if (stack.length > 1) stack.pop();

		const folder = stack.at(-1) ?? stack.at(0)!;

		const options = await driveFilesSelectMenuOptions(folder);
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

		const link = `https://drive.google.com/drive/folders/${folder.id}${
			folder.resourceKey ? `?resourcekey=${folder.resourceKey}` : ''
		}`;
		const panelEmbed = createEmbed(
			`Get Files `,
			`📁 [${path}](${link})\nThe easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = makeComponents(options, link);
		// Disable back button if we hit the first element
		components
			.at(2)!
			.components.at(0)!
			.setDisabled(stack.length === 1);
		await interaction.editReply({ embeds: [panelEmbed], components });
	},
};

export default defaultExport;
