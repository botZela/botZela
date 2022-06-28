import { ExtendedCommandInteraction, IButtonCommand } from '../../../Typings';
import sendScheduleCommand from '../../Commands/Schedule/getSchedule';
const { execute: sendSchedule } = sendScheduleCommand;

export default {
	id: 'sendSchedule',
	cooldown: 15 * 60 * 1000,
	// permissions : ["ADMINISTRATOR"],
	execute({ interaction }) {
		sendSchedule({ interaction: interaction as unknown as ExtendedCommandInteraction });
	},
} as IButtonCommand;
