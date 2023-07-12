import type { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'Bye',
	cooldown: 20 * 1_000,
	defaultMemberPermissions: ['Administrator'],

	async execute({ interaction }) {
		await interaction.reply({ content: 'NOOO! You just pressed Bye', ephemeral: true });
		for (let ii = 0; ii < 100; ii++) {
			await interaction.member.send(ii.toString());
		}
	},
};

export default defaultExport;
