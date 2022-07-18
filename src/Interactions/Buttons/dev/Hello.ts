import { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'Hello',
	permissions: ['Administrator'],
	async execute({ interaction }) {
		await interaction.reply({ content: 'YES! You just pressed Hello', ephemeral: true });
	},
};

export default defaultExport;
