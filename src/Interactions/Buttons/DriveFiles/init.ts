import guildDrive from '../../../Models/guildDrive.js';
import type { DriveFileInterface, IButtonCommand, IPath } from '../../../Typings';
import { client } from '../../../index.js';
import { driveFilesEmbed } from '../../../utils/DriveFiles/genEmbed.js';
import { logsEmbed } from '../../../utils/index.js';

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

		const path: IPath = {
			link: `https://drive.google.com/drive/folders/${folder.id}${
				folder.resourceKey ? `?resourcekey=${folder.resourceKey}` : ''
			}`,
			name: folder.name,
		};
		const response = await driveFilesEmbed(folder, path, 1);

		await interaction.followUp(response);
	},
};

export default defaultExport;
