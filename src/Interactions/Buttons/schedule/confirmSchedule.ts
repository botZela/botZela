import { IButtonCommand } from '../../../Typings';
import sendScheduleCommand from '../../Commands/Schedule/getSchedule';
const { execute: sendSchedule } = sendScheduleCommand;

export default {
	// id: "confirmSchedule",
	// cooldown: 15 * 60 * 1000,
	// permissions : ["ADMINISTRATOR"],
	execute({ interaction }) {},
} as IButtonCommand;
