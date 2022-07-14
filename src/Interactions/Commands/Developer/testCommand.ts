import { MessageActionRow, MessageButton, Modal, TextInputComponent } from 'discord.js';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'test',
	description: 'Just to test buttons',
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'button',
			description: 'Create test Buttons',
			type: 'SUB_COMMAND',
		},
		{
			name: 'modal',
			description: 'Create test Modal',
			type: 'SUB_COMMAND',
		},
		{
			name: 'error',
			description: 'Throw an Error',
			type: 'SUB_COMMAND',
		},
	],
	async execute({ interaction }) {
		const subCommand = interaction.options.getSubcommand();
		if (subCommand === 'button') {
			const row = new MessageActionRow().addComponents(
				new MessageButton({
					customId: 'Hello',
					label: 'Hello',
					style: 'SUCCESS',
				}),
				new MessageButton().setCustomId('Bye').setLabel('Bye').setStyle('DANGER'),
			);
			await interaction.reply({ components: [row] });
		} else if (subCommand === 'modal') {
			const modal = new Modal().setTitle('Test Modal').setCustomId('testmodal');
			const textInput1 = new TextInputComponent({
				customId: 'test1',
				label: 'Question 1',
				style: 'SHORT',
			});
			const textInput2 = new TextInputComponent({
				customId: 'test2',
				label: 'Question 2',
				style: 'PARAGRAPH',
			});
			const action1 = new MessageActionRow({
				components: [textInput1],
			});
			const action2 = new MessageActionRow({
				components: [textInput2],
			});
			modal.addComponents(action1, action2);
			await interaction.showModal(modal);
		} else if (subCommand === 'error') {
			throw new Error('Crashing the Bot');
		}
	},
};

export default defaultExport;
