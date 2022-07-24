import { ComponentType } from 'discord.js';
import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { createEmbed, createErrorEmbed } from '../../../utils';
import { makeComponents, driveFilesSelectMenuOptions } from '../../../utils/DriveFiles';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-prev',
	// defaultMemberPermissions: ['Administrator'],

	execute: async ({ interaction }) => {
		await interaction.deferUpdate();

		const { components: messageComponents } = interaction.message;
		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const stack = client.gdFolderStack.get(interaction.member.id);
		if (!stack) {
			const embed = createErrorEmbed('Get Files', 'Use the button (__**Get Files**__) again.');
			return interaction.editReply({ embeds: [embed], components: [] });
		}
		const folderId = stack.at(-1)!.id;

		const options = await driveFilesSelectMenuOptions(folderId);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, 'This Folder is Empty.').addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: false });
			return;
		}

		let page = 1;
		if (messageComponents[1].components[1].type === ComponentType.Button)
			page = parseInt(messageComponents[1].components[1].customId!, 10) - 1;
		const components = makeComponents(options, folderId, page);
		await interaction.editReply({ components });
	},
};

export default defaultExport;
