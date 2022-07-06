import { ICommand } from '../../../Typings';
import { FiliereType, GroupeType } from '../../../Typings/Ensias';
import { client } from '../../../index';
import { flGrpYr } from '../../../utils/Schedule/flGrp';
import { sendSchedule } from '../../../utils/Schedule/sendSchedule';
import { createEmbed } from '../../../utils/createEmbed';
import { logsMessage } from '../../../utils/logsMessage';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];

const defaultExport: ICommand = {
	name: 'getschedule',
	description: 'Get your schedule based on your group and field.',
	cooldown: 10 * 1000,
	// Permissions: [],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'filiere',
			type: 'STRING',
			description: 'Choose the branch',
			choices: filieresArray.map((x) => ({ name: x, value: x })),
			required: false,
		},
		{
			name: 'groupe',
			type: 'STRING',
			description: 'Choose the groupe',
			choices: groupesArray.map((x) => ({ name: x, value: x })),
			required: false,
		},
		{
			name: 'dm',
			type: 'BOOLEAN',
			description: 'Do you want to receive your schedule in Direct Messages?',
			required: false,
		},
	],
	async execute({ interaction }) {
		const { options, member, guild } = interaction;
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

		if (!member.roles.cache.map((role) => role.name).includes('1A')) {
			return interaction.followUp({
				content: 'This command is only available for 1A Students. Sorry!',
				ephemeral: true,
			});
		}

		const { filiere: fl, groupe: grp } = flGrpYr(member);

		const filiere = (options.getString('filiere') as FiliereType) ?? fl;
		const groupe = (options.getString('groupe') as GroupeType) ?? grp;
		const dm = options.getBoolean('dm') === null ? true : options.getBoolean('dm');

		if (!filiere || !groupe) {
			return interaction.followUp({
				content: 'CHAFAAAAAAR',
				ephemeral: false,
			});
		}

		if (dm) await sendSchedule(member, filiere, groupe);

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