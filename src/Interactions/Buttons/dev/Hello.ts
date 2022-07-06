import { IButtonCommand } from '../../../Typings';

export default {
	id: 'Hello',
	permissions: ['ADMINISTRATOR'],
	async execute({ interaction }) {
		await interaction.reply({ content: 'YES! You just pressed Hello', ephemeral: true });
	},
} as IButtonCommand;
