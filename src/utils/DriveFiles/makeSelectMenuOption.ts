import { MessageSelectOptionData } from 'discord.js';
import { driveSearch } from '../../OtherModules/GDrive';

export async function driveFilesSelectMenuOptions(fileId: string) {
	const output = (await driveSearch(fileId))
		?.map((file) => {
			let value: string | undefined;
			let description: string | undefined;
			if (file.name && file.id) {
				if (file.mimeType === 'application/vnd.google-apps.shortcut' && file.shortcutDetails?.targetId) {
					value = file.shortcutDetails.targetId;
					description =
						file.shortcutDetails.targetMimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File';
				}
				const label = file.name;
				if (!value) value = file.id;
				if (!description) description = file.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File';
				const output: MessageSelectOptionData = {
					label,
					value,
					description,
					emoji: description === 'Folder' ? '📁' : '📄',
				};
				return output;
			}
			return undefined;
		})
		.filter((x): x is MessageSelectOptionData => x !== undefined);
	return output?.length === 0 ? undefined : output;
}
