import { client } from '../../..';
import guildDrive from '../../../Models/guildDrive';
import { DriveFileInterface, IButtonCommand } from '../../../Typings';
import { createEmbed, logsEmbed } from '../../../utils';
import { makeComponents, driveFilesSelectMenuOptions } from '../../../utils/DriveFiles';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-init',
	// defaultMemberPermissions: ['Administrator'],

	execute: async ({ interaction }) => {
		if (interaction.guild) {
			const logs = `%user% used DRIVE button.`;
			await logsEmbed(logs, interaction.guild, 'info', interaction.member);
		}

		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const driveData = await guildDrive.findOne({ messageId: interaction.message.id });

		if (!driveData) {
			return interaction.followUp({ content: 'Could not find the drive that you clicked on', ephemeral: true });
		}
		const { driveId, driveName, driveResourceKey } = driveData;
		const folder: DriveFileInterface = {
			id: driveId,
			name: driveName,
			resourceKey: driveResourceKey,
		};
		client.gdFolderStack.set(interaction.member.id, []);
		client.gdFolderStack.get(interaction.member.id)!.push(folder);

		const options = await driveFilesSelectMenuOptions(folder);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, 'This Folder is Empty.').addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: false });
			return;
		}

		const link = `https://drive.google.com/drive/folders/${folder.id}${
			folder.resourceKey ? `?resourcekey=${folder.resourceKey}` : ''
		}`;
		const panelEmbed = createEmbed(
			`Get Files `,
			`📁 [${folder.name}](${link})\nThe easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = makeComponents(options, link);
		// Disable back button because it is the first folder
		components.at(2)!.components.at(0)!.setDisabled(true);
		await interaction.followUp({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
