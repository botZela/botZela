import { GuildMember } from 'discord.js';
import guildRoles from '../../Models/guildRoles';
import { flGrpYr } from '../Schedule/flGrp';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
const firstPromo = 1995;

function range(size: number, startAt = 0): ReadonlyArray<number> {
	return [...Array(size).keys()].map((i) => i + startAt);
}

export async function downgradeRoles(member: GuildMember) {
	if (member.user.bot) return;
	const guildData = await guildRoles.findOne({ guildId: member.guild.id });
	if (!guildData) return;
	const roles = guildData.roles;

	if (member.roles.cache.map((role) => role.name).includes('Laureate')) {
		const fl = member.roles.cache
			.map((role) => role.name.slice(2))
			.filter((role) => filieresArray.includes(role))
			.at(0)!;

		const promo = new Date().getFullYear();
		const oldPromo = member.roles.cache
			.map((role) => role.name)
			.filter((role) =>
				range(promo - firstPromo + 1, firstPromo)
					.map((num) => num.toString())
					.includes(role),
			)
			.at(0)!;
		if (promo.toString() !== oldPromo) return;

		const roleFiliereId = roles.get(`L_${fl}`);
		const roleLaureatId = roles.get('Laureate');

		const rolePromoId = roles.get(promo.toString());

		await member.roles.remove(
			[rolePromoId ?? '', roleLaureatId ?? '', roleFiliereId ?? ''].filter((role) => role !== ''),
		);

		const currentYear = roles.get('3A');
		const currentFl = roles.get(`_${fl}_`);
		await member.roles.add([currentYear ?? '', currentFl ?? ''].filter((role) => role !== ''));

		return;
	}
	const { year, filiere: fl } = flGrpYr(member);
	if (!fl || !year) return;
	if (year === '3A') {
		const currentYear = roles.get('3A');
		const prevYear = roles.get('2A');

		if (prevYear) await member.roles.add(prevYear);
		if (currentYear) await member.roles.remove(currentYear);
	} else if (year === '2A') {
		const currentYear = roles.get('2A');
		const prevYear = roles.get('1A');

		if (prevYear) await member.roles.add(prevYear);
		if (currentYear) await member.roles.remove(currentYear);
	}
}
