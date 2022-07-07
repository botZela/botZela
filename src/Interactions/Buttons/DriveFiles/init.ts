import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';
import { driveFilesSelectMenuOptions } from '../../../utils/DriveFiles/makeSelectMenuOption';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-init',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });
		const { guild } = interaction;

		if (!guild || !guild.me) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const initialFolder = '1YxhLTBKOtj_hcjWa8ZYslGg88JJUiwBD';
		client.gdFolderStack.set(interaction.member.id, []);
		client.gdFolderStack.get(interaction.member.id)!.push({ id: initialFolder, name: 'ENSIAS' });

		const options = await driveFilesSelectMenuOptions(initialFolder);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, '__**Nothing Found!**__ ');
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: false });
			return;
		}
		const panelEmbed = createEmbed(`Get Files`, `__**Select a Folder**__`);

		const components = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('drivefiles-menu').setPlaceholder('Select a folder: ').addOptions(options),
			),
		];
		await interaction.followUp({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
