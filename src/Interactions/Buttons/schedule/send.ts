import type { IButtonCommand } from '../../../Typings';
import { sendSchedule } from '../../../utils/Schedule';
import { flGrpYr } from '../../../utils/Schedule/flGrp';

const defaultExport: IButtonCommand = {
	id: 'sendSchedule',
	// cooldown: 15 * 60 * 1000,
	async execute({ interaction }) {
		await interaction.deferReply({ ephemeral: true });
		const { filiere, groupe, year } = flGrpYr(interaction.member.roles.cache);
		await sendSchedule(interaction, filiere?.name, groupe?.name, year?.name);
	},
};

export default defaultExport;
