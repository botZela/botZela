import { client } from '../../..';
import ensiasDrive from '../../../Models/guildDrive-Ensias';
import { IButtonCommand } from '../../../Typings';
import { createEmbed, logsMessage } from '../../../utils';
import { makeComponents, driveFilesSelectMenuOptions } from '../../../utils/DriveFiles';
import { flGrpYr } from '../../../utils/Schedule/flGrp';

const defaultExport: IButtonCommand = {
	id: 'button-ensiasfiles-init',
	// permissions: ['Administrator'],

	execute: async ({ interaction }) => {
		const logs = `[INFO] .${interaction.user.tag} have used ENSIAS DRIVE button.`;
		if (interaction.guild) await logsMessage(logs, interaction.guild);

		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const { filiere, year } = flGrpYr(interaction.member);

		const driveData = await ensiasDrive.findOne({ filiere, year });

		if (!driveData) {
			return interaction.followUp({
				content:
					"We are sorry, we don't have your drive (for now). If you have the link to a shared drive, consider sending it to one of the admins. Thanks.",
				ephemeral: true,
			});
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

		const components = makeComponents(options, folderId);
		// Disable back button because it is the first forlder
		components.at(2)!.components.at(0)!.setDisabled(true);
		await interaction.followUp({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
