import { IButtonCommand } from '../../../Typings';

export default {
	// Id: "abortSchedule",
	// cooldown: 15 * 60 * 1000,
	// permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await interaction.update({
			content: `You just Aborted the process`,
			embeds: [],
			components: [],
		});
	},
} as IButtonCommand;
