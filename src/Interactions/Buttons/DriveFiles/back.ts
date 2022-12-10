import { client } from '../../..';
import ensiasDrive from '../../../Models/guildDrive-Ensias';
import { DriveFileInterface, IButtonCommand, IPath } from '../../../Typings';
import { createErrorEmbed } from '../../../utils';
import { driveFilesEmbed } from '../../../utils/DriveFiles';

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

		if (folder.id === 'ensiasDrive') {
			const [year, filiere] = folder.name.split('_');
			const driveData = await ensiasDrive.findOne({ filiere: filiere, year: year });
			const driveArray: DriveFileInterface[] = driveData!.drivesArray.map((drive) => ({
				id: drive.driveId,
				name: drive.driveName,
				resourceKey: drive.driveResourceKey,
				mimeType: drive.driveMimeType,
			}));

			const path: IPath = {
				name: folder.name,
				link: interaction.message.url,
			};

			const response = await driveFilesEmbed(driveArray, path, 1);
			await interaction.editReply(response);
			return;
		}

		const path: IPath = {
			name: stack.map((x) => x.name).join('/'),
			link: `https://drive.google.com/drive/folders/${folder.id}${
				folder.resourceKey ? `?resourcekey=${folder.resourceKey}` : ''
			}`,
		};

		const response = await driveFilesEmbed(folder, path, stack.length);
		await interaction.editReply(response);
	},
};

export default defaultExport;
