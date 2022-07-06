import { MessageActionRow, MessageButton } from 'discord.js';
import { ICommand } from '../../../Typings';

export default {
	name: 'testbutton',
	description: 'Just to test buttons',
	permissions: ['ADMINISTRATOR'],

	async execute({ interaction }) {
		const row = new MessageActionRow();
		row.addComponents(
			new MessageButton({
				customId: 'Hello',
				label: 'Hello',
				style: 'SUCCESS',
			}),
			new MessageButton().setCustomId('Bye').setLabel('Bye').setStyle('DANGER'),
		);

		await interaction.reply({ components: [row] });
	},
} as ICommand;
