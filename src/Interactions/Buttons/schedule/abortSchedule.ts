import { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'abortSchedule',
	// cooldown: 15 * 60 * 1000,
	// defaultMemberPermissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await interaction.update({
			content: `You just Aborted the process`,
			embeds: [],
			components: [],
		});
	},
};

export default defaultExport;
