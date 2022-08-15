import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import { client } from '../../..';
import { generatePublicUrl } from '../../../OtherModules/GDrive';
import { IButtonCommand } from '../../../Typings';
import { createEmbed, createErrorEmbed, logsEmbed } from '../../../utils';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-send',
	execute: async ({ interaction }) => {
		const logs = `%user% have received a file from the drive.`;
		if (interaction.guild) await logsEmbed(logs, interaction.guild, 'info', interaction.member);

		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const userStack = client.gdFolderStack.get(interaction.member.id);
		if (!userStack) {
			const embed = createErrorEmbed('Get Files', 'Use the button (__**Get Files**__) again.');
			return interaction.editReply({ embeds: [embed], components: [] });
		}
		const { id: fileId, name: fileName } = userStack.at(-1)!;
		const fileObj = await generatePublicUrl(fileId);
		const resultEmbed = createEmbed(`Get Files `, `📄 ${fileName}`);
		const component = new ActionRowBuilder<MessageActionRowComponentBuilder>();
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
			);
		}
		await interaction.member.send({
			components: [component],
			embeds: [resultEmbed],
		});
		await interaction.followUp({ content: 'Check your Direct Messages to download or view the file.' });
	},
};

export default defaultExport;
