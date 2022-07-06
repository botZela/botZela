import { IButtonCommand } from '../../../Typings';

export default {
	id: 'confirmSchedule',
	cooldown: 15 * 60 * 1000,
	permissions: ['ADMINISTRATOR'],
	execute({ interaction }) {
		return interaction.reply({ content: 'aaaaaa' });
	},
} as IButtonCommand;
