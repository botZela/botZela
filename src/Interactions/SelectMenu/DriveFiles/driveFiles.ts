import { MessageActionRow, MessageButton, MessageEmbedOptions } from 'discord.js';
import { client } from '../../..';
import { generatePublicUrl } from '../../../OtherModules/GDrive';
import { ISelectMenuCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';
import { makeComponents, driveFilesSelectMenuOptions } from '../../../utils/DriveFiles';

const defaultExport: ISelectMenuCommand = {
	id: 'drivefiles-menu',
	async execute({ interaction }) {
		await interaction.deferUpdate();

		if (!interaction.inGuild()) {
			const embed: MessageEmbedOptions = {
				color: 'RED',
				title: 'Get Files',
				description: 'This command is used inside a server ...',
			};
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}
		const userStack = client.gdFolderStack.get(interaction.member.id);
		if (!userStack) {
			const embed: MessageEmbedOptions = {
				color: 'RED',
				title: 'Get Files',
				description: 'Use the button (__**Get Files**__) again.',
			};
			return interaction.editReply({ embeds: [embed], components: [] });
		}

		const { values, component } = interaction;

		const fileId = values[0];
		const fileIndex = component.options.findIndex((x) => x.value === fileId);
		// const fileDesc = component.options.at(fileIndex)?.description;
		const fileName = component.options.at(fileIndex)?.label;
		const fileEmoji = component.options.at(fileIndex)?.emoji;

		if (fileEmoji?.name === '📄') {
			const fileObj = await generatePublicUrl(fileId);
			const resultEmbed = createEmbed(`Get Files `, `📄 ${fileName ?? 'File'}`);
			const component = new MessageActionRow().addComponents(
				new MessageButton({ customId: 'button-drivefiles-back', label: 'Back', style: 'SECONDARY', emoji: '⬅' }),
			);
			if (fileObj.webViewLink) {
				resultEmbed.addField(`View File`, `Click [here](${fileObj.webViewLink}) to view the file.`);
				component.addComponents(
					new MessageButton({ style: 'LINK', url: fileObj.webViewLink, label: 'View File', emoji: '📃' }),
				);
			}
			if (fileObj.webContentLink) {
				resultEmbed.addField(`Download File`, `Click [here](${fileObj.webContentLink}) to download the file.`);
				component.addComponents(
					new MessageButton({ style: 'LINK', url: fileObj.webContentLink, label: 'Download File', emoji: '📥' }),
					new MessageButton({
						style: 'SUCCESS',
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
			userStack.push({ id: fileId, name: fileName ?? '' });
			return;
		}

		const options = await driveFilesSelectMenuOptions(fileId);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, 'This Folder is Empty.').addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
		userStack.push({ id: fileId, name: fileName ?? '' });
		const path = userStack.map((x) => x.name).join('/');
		const panelEmbed = createEmbed(
			`Get Files `,
			`📁 [${path}](https://drive.google.com/drive/folders/${fileId})\nThe easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = makeComponents(options, fileId);

		await interaction.editReply({
			embeds: [panelEmbed],
			components: components,
		});
	},
};

export default defaultExport;
