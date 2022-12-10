import { ComponentType } from 'discord.js';
import { client } from '../../..';
import ensiasDrive from '../../../Models/guildDrive-Ensias';
import { DriveFileInterface, IButtonCommand, IPath } from '../../../Typings';
import { createErrorEmbed } from '../../../utils';
import { driveFilesEmbed } from '../../../utils/DriveFiles';

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
		const folder = stack.at(-1)!;

		let page = 1;
		if (messageComponents[1].components[1].type === ComponentType.Button)
			page = parseInt(messageComponents[1].components[1].customId!, 10) - 1;

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

			const response = await driveFilesEmbed(driveArray, path, 1, page);
			await interaction.editReply(response);
			return;
		}

		const path: IPath = {
			name: stack.map((x) => x.name).join('/'),
			link: `https://drive.google.com/drive/folders/${folder.id}${
				folder.resourceKey ? `?resourcekey=${folder.resourceKey}` : ''
			}`,
		};

		const response = await driveFilesEmbed(folder, path, stack.length, page);
		await interaction.editReply(response);
	},
};

export default defaultExport;
