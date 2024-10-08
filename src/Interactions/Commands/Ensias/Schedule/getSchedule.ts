import { ApplicationCommandOptionType } from 'discord.js';
import { client } from '../../../..';
import type { ICommand } from '../../../../Typings';
import type { FiliereNameType, GroupeNameType, YearNameType } from '../../../../Typings/Ensias';
import { sendSchedule } from '../../../../utils/Schedule';
import { flGrpYr } from '../../../../utils/Schedule/flGrp';
// import { sendSchedule } from '../../../../utils/Schedule/sendSchedule';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];
// const yearArray = ['1A', '2A', '3A'];
const yearArray = ['1A'];

const defaultExport: ICommand = {
	name: 'getschedule',
	description: 'Get your schedule based on your group and field.',
	cooldown: 10 * 1_000,
	// Permissions: [],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'annee',
			type: ApplicationCommandOptionType.String,
			description: 'Choose the year',
			choices: yearArray.map((x) => ({ name: x, value: x })),
			required: false,
		},
		{
			name: 'filiere',
			type: ApplicationCommandOptionType.String,
			description: 'Choose the branch',
			choices: filieresArray.map((x) => ({ name: x, value: x })),
			required: false,
		},
		{
			name: 'groupe',
			type: ApplicationCommandOptionType.String,
			description: 'Choose the groupe',
			choices: groupesArray.map((x) => ({ name: x, value: x })),
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

		const { filiere: fl, groupe: grp, year: yr } = flGrpYr(member.roles.cache);
		const filiere = (options.getString('filiere') as FiliereNameType) ?? fl?.name;
		const groupe = (options.getString('groupe') as GroupeNameType) ?? grp?.name;
		const year = (options.getString('annee') as YearNameType) ?? yr?.name;

		await sendSchedule(interaction, filiere, groupe, year);
	},
};

export default defaultExport;
