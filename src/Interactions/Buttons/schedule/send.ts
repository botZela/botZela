import { ExtendedCommandInteraction, IButtonCommand } from '../../../Typings';
import sendScheduleCommand from '../../Commands/Schedule/getSchedule';
const { execute: sendSchedule } = sendScheduleCommand;

const defaultExport: IButtonCommand = {
	id: 'sendSchedule',
	cooldown: 15 * 60 * 1000,
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await sendSchedule({ interaction: interaction as unknown as ExtendedCommandInteraction });
	},
};

export default defaultExport;
