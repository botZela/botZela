import type { IButtonCommand } from '../../../Typings';
import { flGrpYr } from '../../../utils/Schedule/flGrp.js';
import { sendSchedule } from '../../../utils/Schedule/index.js';

const defaultExport: IButtonCommand = {
	id: 'sendSchedule',
	// cooldown: 15 * 60 * 1000,
	async execute({ interaction }) {
		await interaction.deferReply({ ephemeral: true });
		const { filiere, groupe, year } = flGrpYr(interaction.member);
		await sendSchedule(interaction, filiere?.name, groupe?.name, year?.name);
	},
};

export default defaultExport;
