import { IModalSubmitCommand } from '../../../Typings';

const defaultExport: IModalSubmitCommand = {
	id: 'testmodal',
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		const value1 = interaction.fields.getTextInputValue('test1');
		const value2 = interaction.fields.getTextInputValue('test2');

		await interaction.reply({
			content: `${value1}\n\n${value2}`,
			ephemeral: true,
		});
	},
};

export default defaultExport;
