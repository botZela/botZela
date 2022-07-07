import { MessageSelectOptionData } from 'discord.js';
import { driveSearch } from '../../OtherModules/GDrive';

export async function driveFilesSelectMenuOptions(fileId: string) {
	return (await driveSearch(fileId))
		?.map((file) => {
			if (file.name && file.id) {
				const output: MessageSelectOptionData = {
					label: file.name,
					value: file.id,
					description: file.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File',
				};
				return output;
			}
			return undefined;
		})
		.filter((x): x is MessageSelectOptionData => x !== undefined);
}
