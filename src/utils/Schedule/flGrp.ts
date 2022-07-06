import { GuildMember } from 'discord.js';
import { FiliereType, GroupeType, YearType } from '../../Typings/Ensias';

export function flGrpYr(member: GuildMember) {
	const roles = member.roles.cache;

	const filieresArray = ['_2IA_', '_2SCL_', '_BI&A_', '_GD_', '_GL_', '_IDF_', '_IDSIT_', '_SSE_', '_SSI_'];
	const fl = roles
		.map((r) => r.name)
		.filter((role) => filieresArray.includes(role))
		.at(0)
		?.slice(1, -1) as FiliereType;

	const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];
	const grp = roles
		.map((r) => r.name)
		.filter((role) => groupesArray.includes(role))
		.at(0) as GroupeType;

	const yearArray = ['1A', '2A', '3A'];
	const yr = roles
		.map((r) => r.name)
		.filter((role) => yearArray.includes(role))
		.at(0) as YearType;
	return { filiere: fl, groupe: grp, year: yr };
}
