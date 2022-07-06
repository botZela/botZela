import { ExtendedCommandInteraction, IButtonCommand } from '../../../Typings';
import getAssuranceCommand from '../../Commands/Assurance/getAssurance';
const { execute: sendInsurance } = getAssuranceCommand;

const defaultExport: IButtonCommand = {
	id: 'sendAssurance',
	cooldown: 10 * 60 * 1000,
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await sendInsurance({ interaction: interaction as unknown as ExtendedCommandInteraction });
	},
};

export default defaultExport;