import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';
import { driveFilesSelectMenuOptions } from '../../../utils/DriveFiles/makeSelectMenuOption';

const defaultExport: IButtonCommand = {
	id: 'button-drivefiles-back',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		await interaction.deferUpdate();

		if (!interaction.guild) {
			return interaction.editReply({ content: 'This command is used inside a server ...' });
		}
		const stack = client.gdFolderStack.get(interaction.member.id);
		if (stack && stack.length > 1) stack.pop();

		const folderId = stack?.at(-1)?.id ?? '1YxhLTBKOtj_hcjWa8ZYslGg88JJUiwBD';

		const options = await driveFilesSelectMenuOptions(folderId);
		if (!options) {
			const errorEmbed = createEmbed(`Get Files`, '__**Nothing Found!**__ ');
			await interaction.editReply({ embeds: [errorEmbed] });
			return;
		}
		const path = client.gdFolderStack
			.get(interaction.member.id)!
			.map((x) => x.name)
			.join('/');
		const panelEmbed = createEmbed(`Get Files`, `__**${path}**__ `);

		const components = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId('drivefiles-menu').setPlaceholder('Select a folder: ').addOptions(options),
			),
			new MessageActionRow().addComponents(
				new MessageButton({ customId: 'button-drivefiles-back', label: 'Back', style: 'SECONDARY' }),
			),
		];
		await interaction.editReply({ embeds: [panelEmbed], components });
	},
};

export default defaultExport;
