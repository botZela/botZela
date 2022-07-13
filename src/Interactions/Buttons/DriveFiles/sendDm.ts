import { MessageActionRow, MessageButton, MessageEmbedOptions } from 'discord.js';
import { client } from '../../..';
import { generatePublicUrl } from '../../../OtherModules/GDrive';
import { IButtonCommand } from '../../../Typings';
import { createEmbed, logsMessage } from '../../../utils';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-send',
	execute: async ({ interaction }) => {
		const logs = `[INFO] .${interaction.user.tag} have received a file from the drive.`;
		if (interaction.guild) await logsMessage(logs, interaction.guild);

		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
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
		const { id: fileId, name: fileName } = userStack.at(-1)!;
		const fileObj = await generatePublicUrl(fileId);
		const resultEmbed = createEmbed(`Get Files `, `📄 ${fileName}`);
		const component = new MessageActionRow();
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
