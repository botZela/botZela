import { GuildMember } from 'discord.js';
import { FiliereType, GroupeType, YearType } from '../../Typings/Ensias';

export function flGrpYr(member: GuildMember) {
	const roles = member.roles.cache.map((r) => ({ name: r.name, id: r.id }));

	const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
	const fl = roles.filter(({ name }) => filieresArray.includes(name.slice(1, -1))).at(0) as FiliereType;

	const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];
	const grp = roles.filter(({ name }) => groupesArray.includes(name)).at(0) as GroupeType;

	const yearArray = ['1A', '2A', '3A'];
	const yr = roles.filter(({ name }) => yearArray.includes(name)).at(0) as YearType;
	return { filiere: fl, groupe: grp, year: yr };
}
