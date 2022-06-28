import { IButtonCommand } from '../../../Typings';

export default {
	// id: "abortSchedule",
	// cooldown: 15 * 60 * 1000,
	// permissions : ["ADMINISTRATOR"],
	execute({ interaction }) {
		interaction.update({
			content: `You just Aborted the process`,
			embeds: [],
			components: [],
		});
	},
} as IButtonCommand;
