import { SelectMenuComponentOptionData } from 'discord.js';
import { driveSearch } from '../../OtherModules/GDrive';
import { DriveFileInterface } from '../../Typings';

export function driveFilesSelectMenuOptionsFromArray(folders: DriveFileInterface[] | undefined) {
	const output = folders
		?.map((file) => {
			let value: string | undefined;
			let description: string | undefined;
			if (file.name && file.id) {
				const folder: { id: string; rk?: string } = {
					id: '',
				};
				if (file.mimeType === 'application/vnd.google-apps.shortcut' && file.shortcutDetails?.targetId) {
					folder.id = file.shortcutDetails.targetId;
					if (file.shortcutDetails.targetResourceKey) folder.rk = file.shortcutDetails.targetResourceKey;
					value = JSON.stringify(folder);
					description =
						file.shortcutDetails.targetMimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File';
				}
				const label = file.name;
				if (!value) {
					folder.id = file.id;
					if (file.resourceKey) folder.rk = file.resourceKey;
					value = JSON.stringify(folder);
				}
				if (!description) description = file.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File';
				const output: SelectMenuComponentOptionData = {
					label,
					value,
					description,
					emoji: description === 'Folder' ? '📁' : '📄',
				};
				return output;
			}
			return undefined;
		})
		.filter((x): x is SelectMenuComponentOptionData => x !== undefined);
	return output?.length === 0 ? undefined : output;
}

export async function driveFilesSelectMenuOptions(folder: DriveFileInterface | DriveFileInterface[]) {
	if (Array.isArray(folder)) {
		const output = driveFilesSelectMenuOptionsFromArray(folder);
		return output?.length === 0 ? undefined : output;
	}
	const folderArray = await driveSearch(folder);
	const output = driveFilesSelectMenuOptionsFromArray(folderArray as DriveFileInterface[]);

	return output?.length === 0 ? undefined : output;
}
