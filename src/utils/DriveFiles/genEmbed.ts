import type { InteractionReplyOptions, MessageActionRowComponentBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { generatePublicUrl } from '../../OtherModules/GDrive';
import type { DriveFileInterface, IPath } from '../../Typings';
import { createEmbed } from '../Embeds';
import { makeComponents } from './makeComponents';
import { driveFilesSelectMenuOptions } from './makeSelectMenuOption';

export async function fileEmbed(file: DriveFileInterface): Promise<InteractionReplyOptions> {
	const fileObj = await generatePublicUrl({ name: file.name, id: file.id, resourceKey: file.resourceKey });
	const resultEmbed = createEmbed(`Get Files `, `📄 ${file.name}`);
	const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
		new ButtonBuilder({
			customId: 'button-drivefiles-back',
			label: 'Back',
			style: ButtonStyle.Secondary,
			emoji: '⬅',
		}),
	);
	if (fileObj.webViewLink) {
		resultEmbed.addFields([{ name: `View File`, value: `Click [here](${fileObj.webViewLink}) to view the file.` }]);
		component.addComponents(
			new ButtonBuilder({ style: ButtonStyle.Link, url: fileObj.webViewLink, label: 'View File', emoji: '📃' }),
		);
	}

	if (fileObj.webContentLink) {
		resultEmbed.addFields([
			{ name: `Download File`, value: `Click [here](${fileObj.webContentLink}) to download the file.` },
		]);
		component.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: fileObj.webContentLink,
				label: 'Download File',
				emoji: '📥',
			}),
			new ButtonBuilder({
				style: ButtonStyle.Success,
				customId: 'button-drivefiles-send',
				label: 'Receive File',
				emoji: '📩',
			}),
		);
	}

	resultEmbed.addFields(
		{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
		{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
	);
	return {
		components: [component],
		embeds: [resultEmbed],
	};
}

export async function driveFilesEmbed(
	folder: DriveFileInterface | DriveFileInterface[],
	path: IPath,
	stacklength: number,
	page = 1,
): Promise<InteractionReplyOptions> {
	const options = await driveFilesSelectMenuOptions(folder);
	if (!options) {
		const errorEmbed = createEmbed(`Get Files`, 'This Folder is Empty.').addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);
		return { embeds: [errorEmbed] };
	}

	const panelEmbed = createEmbed(
		`Get Files `,
		`📁 [${path.name}](${path.link})\nThe easiest way to get access directly to the files that you are looking for.\n`,
	).addFields(
		{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
		{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
	);

	const components = makeComponents(options, path, stacklength, page);
	return { embeds: [panelEmbed], components };
}
