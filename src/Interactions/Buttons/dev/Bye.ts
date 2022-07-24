import { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'Bye',
	cooldown: 20 * 1000,
	defaultMemberPermissions: ['Administrator'],

	async execute({ interaction }) {
		await interaction.reply({ content: 'NOOO! You just pressed Bye', ephemeral: true });
		for (let i = 0; i < 100; i++) {
			await interaction.member.send(i.toString());
		}
	},
};

export default defaultExport;
