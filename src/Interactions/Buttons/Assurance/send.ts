import { ExtendedCommandInteraction, IButtonCommand } from '../../../Typings';
import getAssuranceCommand from '../../Commands/Assurance/getAssurance';
const { execute: sendInsurance } = getAssuranceCommand;

export default {
	id: 'sendAssurance',
	cooldown: 10 * 60 * 1000,
	// permissions : ["ADMINISTRATOR"],
	execute({ interaction }) {
		sendInsurance({ interaction: interaction as unknown as ExtendedCommandInteraction });
	},
} as IButtonCommand;
