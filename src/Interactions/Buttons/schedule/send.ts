import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { createEmbed, logsMessage } from '../../../utils';
import { sendSchedule } from '../../../utils/Schedule';
import { flGrpYr } from '../../../utils/Schedule/flGrp';

const defaultExport: IButtonCommand = {
	id: 'sendSchedule',
	cooldown: 15 * 60 * 1000,
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		const { member, guild } = interaction;
		await interaction.deferReply({ ephemeral: true });
		if (!guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		if (guild.id !== client.testGuilds.find((server) => server.name.includes('ENSIAS'))?.id) {
			return interaction.followUp({
				content: 'This command is not available for this server.',
				ephemeral: true,
			});
		}

		const { filiere, groupe, year } = flGrpYr(member);

		if (year !== '1A') {
			return interaction.followUp({
				content: 'This command is only available for 1A Students. Sorry!',
				ephemeral: true,
			});
		}

		if (!filiere || !groupe) {
			return interaction.followUp({
				content: 'CHAFAAAAAAR',
				ephemeral: false,
			});
		}

		await sendSchedule(member, filiere, groupe);

		// Let text = `__**Your Schedule of this week :**__ \n__Filiere__: ${filiere}\n__Groupe__: ${groupe}\n` ;
		// let fileNamePng = `Emploi_${filiere}_${groupe}.png`;
		// let fileNamePdf = `Emploi_${filiere}_${groupe}.pdf`;
		// let embed = createEmbed(`Schedule ${filiere} ${groupe}`, "__**Your Schedule of this week :**__ ");
		const text = `__**The Planning of S2 Finals.**__ `;
		const fileNamePng1 = `Planning_Rattrapages_S2-1.png`;
		const fileNamePng2 = `Planning_Rattrapages_S2-2.png`;
		const fileNamePdf = `Planning_Rattrapages_S2.pdf`;
		const embed = createEmbed(`Finals Schedule`, '__**Finals Schedule (Rattrapages)**__ ');
		// Let fileNamePng1 = `Planning_examens_S2-1.png`;
		// let fileNamePng2 = `Planning_examens_S2-2.png`;
		// let fileNamePdf = `Planning_examens_S2.pdf`;
		// let embed = createEmbed(`Finals Schedule`, "__**Finals Schedule**__ ");
		await interaction.followUp({
			content: text,
			embeds: [embed],
			files: [
				`./data/Schedules/emploi_1A/${fileNamePdf}`,
				`./data/Schedules/emploi_1A/${fileNamePng1}`,
				`./data/Schedules/emploi_1A/${fileNamePng2}`,
			],
			ephemeral: true,
		});
		const logs = `[INFO] .${member.nickname ?? member.user.tag} got their finals (Rattrapages) Schedule.`;
		await logsMessage(logs, guild);
	},
};

export default defaultExport;
