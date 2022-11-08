import { isDeepStrictEqual } from 'util';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import ensiasData from '../../Models/ensiasData';
import { driveSearchName, getFile, givePermissionsToAnyone } from '../../OtherModules/GDrive';
import { DriveFileInterface, ExtendedButtonInteraction, ExtendedCommandInteraction } from '../../Typings';
import { FiliereNameType, GroupeNameType, YearNameType } from '../../Typings/Ensias';
import { createEmbed } from '../Embeds';
import { logsEmbed } from '../Logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendSchedule(
	interaction: ExtendedButtonInteraction | ExtendedCommandInteraction,
	filiere: FiliereNameType,
	groupe: GroupeNameType,
	year: YearNameType,
) {
	const { guild, member } = interaction;

	if (!guild) {
		return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
	}
	if (!year || !filiere || (year === '1A' && !groupe)) {
		return interaction.followUp({
			content: 'A HSSLTIII',
			ephemeral: false,
		});
	}

	const folderData = await ensiasData.findOne({ driveName: `Emploi_${year}` });

	if (!folderData) {
		return interaction.followUp({
			content: 'Unsupported (for now).',
			ephemeral: true,
		});
	}

	const folder: DriveFileInterface = {
		id: folderData.driveId,
		name: folderData.driveName,
		resourceKey: folderData.driveResourceKey,
	};

	const fileName = `${filiere}${year === '1A' ? `_${groupe ?? ''}` : ''}`;

	const files = await driveSearchName(folder, `Emploi_${fileName}`);
	if (!files || files.length === 0) {
		return interaction.followUp({
			content: "Didn't find your Schedule.",
			ephemeral: true,
		});
	}

	const filesObjList = await Promise.all(
		files
			.map((file) => ({
				id: file.id ?? '',
				name: file.name ?? '',
				resourceKey: file.resourceKey ?? '',
			}))
			.map((file) => getFile(file, ['id', 'mimeType', 'webViewLink', 'webContentLink', 'permissions'])),
	);

	let pngLink = '';
	const pngLinks: { webViewLink?: string; webContentLink?: string } = {};
	const pdfLinks: { webViewLink?: string; webContentLink?: string } = {};
	const anyonePerm = {
		kind: 'drive#permission',
		id: 'anyoneWithLink',
		type: 'anyone',
		role: 'reader',
		allowFileDiscovery: false,
	};

	for (const fileObj of filesObjList) {
		if (!fileObj.permissions?.some((y) => isDeepStrictEqual(y, anyonePerm)))
			await givePermissionsToAnyone(fileObj.id ?? '');

		if (fileObj.mimeType === 'application/pdf') {
			pdfLinks.webContentLink = fileObj.webContentLink ?? undefined;
			pdfLinks.webViewLink = fileObj.webViewLink ?? undefined;
		} else if (fileObj.mimeType === 'image/png') {
			pngLink = fileObj.webContentLink ?? '';
			pngLinks.webContentLink = fileObj.webContentLink ?? '';
			pngLinks.webViewLink = fileObj.webViewLink ?? '';
		}
	}

	const resultEmbed = createEmbed(`📆 Schedule For ${year}_${fileName}`);

	const component = new ActionRowBuilder<MessageActionRowComponentBuilder>();
	if (pdfLinks.webViewLink) {
		component.addComponents(
			new ButtonBuilder({ style: ButtonStyle.Link, url: pdfLinks.webViewLink, label: 'View PDF', emoji: '📃' }),
		);
	}
	if (pdfLinks.webContentLink) {
		component.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: pdfLinks.webContentLink,
				label: 'Download PDF',
				emoji: '📥',
			}),
		);
	}
	component.addComponents(
		new ButtonBuilder({
			style: ButtonStyle.Success,
			customId: 'button-schedule-send',
			label: 'Receive Schedule',
			emoji: '📩',
		}),
	);
	resultEmbed.addFields(
		{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
		{ name: 'Any Errors', value: 'Consider sending them in <#939564676038140004>, Thanks.' },
	);
	resultEmbed.setImage(pngLink);
	await interaction.editReply({
		components: [component],
		embeds: [resultEmbed],
	});

	const logs = `%user% got the Schedule for ${year}_${fileName}.`;
	await logsEmbed(logs, guild, 'info', member);
}
