import { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'confirmSchedule',
	cooldown: 15 * 60 * 1000,
	permissions: ['ADMINISTRATOR'],
	execute({ interaction }) {
		return interaction.reply({ content: 'aaaaaa' });
	},
};

export default defaultExport;