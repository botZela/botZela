import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageActionRowComponentBuilder,
	SelectMenuComponent,
} from 'discord.js';
import { client } from '../../..';
import { generatePublicUrl } from '../../../OtherModules/GDrive';
import { ISelectMenuCommand } from '../../../Typings';
import { createEmbed, createErrorEmbed } from '../../../utils';
import { makeComponents, driveFilesSelectMenuOptions } from '../../../utils/DriveFiles';

const defaultExport: ISelectMenuCommand = {
	id: 'drivefiles-menu',
	async execute({ interaction }) {
		await interaction.deferUpdate();

		if (!interaction.inGuild()) {
			const embed = createErrorEmbed('Get Files', 'This command is used inside a server ...');
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}
		const userStack = client.gdFolderStack.get(interaction.member.id);
		if (!userStack) {
			const embed = createErrorEmbed('Get Files', 'Use the button (__**Get Files**__) again.');
			return interaction.editReply({ embeds: [embed], components: [] });
		}

		const { values } = interaction;

		const component = interaction.component as SelectMenuComponent;
		const file = JSON.parse(values[0]) as { id: string; rk?: string };
		const fileIndex = component.options
			.map((x) => (JSON.parse(x.value) as { id: string; rk?: string }).id)
			.findIndex((x) => x === file.id);
		const fileName = component.options.at(fileIndex)?.label;
		const fileEmoji = component.options.at(fileIndex)?.emoji;

		if (fileEmoji?.name === '📄') {
			const fileObj = await generatePublicUrl({ name: fileName ?? '', id: file.id, resourceKey: file.rk });
			const resultEmbed = createEmbed(`Get Files `, `📄 ${fileName ?? 'File'}`);
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
			await interaction.editReply({
				components: [component],
				embeds: [resultEmbed],
			});
			userStack.push({ id: file.id, name: fileName ?? '' });
			return;
		}

		const options = await driveFilesSelectMenuOptions({ id: file.id, name: '', resourceKey: file.rk });
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, 'This Folder is Empty.').addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
		userStack.push({ id: file.id, name: fileName ?? '', resourceKey: file.rk });
		const path = userStack.map((x) => x.name).join('/');

		const link = `https://drive.google.com/drive/folders/${file.id}${file.rk ? `?resourcekey=${file.rk}` : ''}`;
		const panelEmbed = createEmbed(
			`Get Files `,
			`📁 [${path}](${link})\nThe easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = makeComponents(options, link);

		await interaction.editReply({
			embeds: [panelEmbed],
			components: components,
		});
	},
};

export default defaultExport;
