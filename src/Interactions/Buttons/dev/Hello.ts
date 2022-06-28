import { IButtonCommand } from '../../../Typings';

export default {
	id: 'Hello',
	permissions: ['ADMINISTRATOR'],
	execute({ interaction }) {
		interaction.reply({ content: 'YES! You just pressed Hello', ephemeral: true });
	},
} as IButtonCommand;
