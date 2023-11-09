import type { Collection, Role } from 'discord.js';
import type { FiliereType, GroupeType, YearFiliereType, YearType } from '../../Typings/Ensias';

export function flGrpYr(roles: Collection<string, Role>) {
	const filieresArray = ['_2IA_', '_2SCL_', '_BI&A_', '_GD_', '_GL_', '_IDF_', '_IDSIT_', '_SSE_', '_SSI_'];
	const fl = roles
		.filter(({ name }) => filieresArray.includes(name))
		.map(({ id, name }) => ({ id, name: name.slice(1, -1) }))
		.at(0) as FiliereType;

	const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];
	const grp = roles.filter(({ name }) => groupesArray.includes(name)).at(0) as GroupeType;

	const yearArray = ['1A', '2A', '3A'];
	const yr = roles.filter(({ name }) => yearArray.includes(name)).at(0) as YearType;

	const yr_fl = roles.filter(({ name }) => yearArray.some((x) => name.startsWith(x))).at(0) as YearFiliereType;
	return { filiere: fl, groupe: grp, year: yr, year_filiere: yr_fl };
}
