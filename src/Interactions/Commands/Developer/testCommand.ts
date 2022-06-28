import { MessageActionRow, MessageButton, Interaction } from 'discord.js';
import { ICommand } from '../../../Typings';

export default {
	name: 'testbutton',
	description: 'Just to test buttons',
	permissions: ['ADMINISTRATOR'],

	execute({ interaction }) {
		const row = new MessageActionRow();
		row.addComponents(
			new MessageButton({
				customId: 'Hello',
				label: 'Hello',
				style: 'SUCCESS',
			}),
			new MessageButton().setCustomId('Bye').setLabel('Bye').setStyle('DANGER'),
		);

		interaction.reply({ components: [row] });
	},
} as ICommand;
