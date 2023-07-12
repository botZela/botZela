import type { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'confirmSchedule',
	cooldown: 15 * 60 * 1_000,
	defaultMemberPermissions: ['Administrator'],
	async execute({ interaction }) {
		return interaction.reply({ content: 'aaaaaa' });
	},
};

export default defaultExport;
