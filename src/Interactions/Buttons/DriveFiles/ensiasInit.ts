import { client } from '../../..';
import ensiasDrive from '../../../Models/guildDrive-Ensias';
import type { DriveFileInterface, IButtonCommand, IPath } from '../../../Typings';
import { logsEmbed } from '../../../utils';
import { driveFilesEmbed } from '../../../utils/DriveFiles/genEmbed';
import { flGrpYr } from '../../../utils/Schedule/flGrp';

const defaultExport: IButtonCommand = {
	id: 'button-ensiasfiles-init',
	// defaultMemberPermissions: ['Administrator'],

	execute: async ({ interaction }) => {
		if (interaction.guild) {
			const logs = `%user% used ENSIAS DRIVE button.`;
			await logsEmbed(logs, interaction.guild, 'info', interaction.member);
		}

		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const { filiere, year } = flGrpYr(interaction.member);

		const driveData = await ensiasDrive.findOne({ filiere: filiere!.name, year: year!.name });

		if (!driveData) {
			return interaction.followUp({
				content:
					"We are sorry, we don't have your drive (for now). If you have the link to a shared drive, consider sending it to one of the admins. Thanks.",
				ephemeral: true,
			});
		}

		const driveArray: DriveFileInterface[] = driveData.drivesArray.map((drive) => ({
			id: drive.driveId,
			name: drive.driveName,
			resourceKey: drive.driveResourceKey,
			mimeType: drive.driveMimeType,
		}));

		const folder: DriveFileInterface = {
			id: driveArray.length === 1 ? driveArray.at(0)!.id : 'ensiasDrive',
			name: driveArray.length === 1 ? driveArray.at(0)!.name : `${year!.name ?? ''}_${filiere!.name ?? ''}`,
		};

		client.gdFolderStack.set(interaction.member.id, []);
		client.gdFolderStack.get(interaction.member.id)!.push(folder);

		if (driveArray.length === 1) {
			const path: IPath = {
				name: folder.name,
				link: `https://drive.google.com/drive/folders/${folder.id}${
					folder.resourceKey ? `?resourcekey=${folder.resourceKey}` : ''
				}`,
			};
			const response = await driveFilesEmbed(folder, path, 1);
			await interaction.followUp(response);
		} else {
			const path: IPath = {
				name: `${year!.name ?? ''}_${filiere!.name ?? ''}`,
				link: interaction.message.url,
			};
			const response = await driveFilesEmbed(driveArray, path, 1);
			await interaction.followUp(response);
		}
	},
};

export default defaultExport;
