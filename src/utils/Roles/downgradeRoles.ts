import type { GuildMember } from 'discord.js';
import guildRoles from '../../Models/guildRoles';
import { flGrpYr } from '../Schedule/flGrp';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
const firstPromo = 1_995;

function range(size: number, startAt = 0): readonly number[] {
	return [...Array.from({ length: size }).keys()].map((ii) => ii + startAt);
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
		const currentYrFl = roles.get(`3A_${fl}`);
		await member.roles.add([currentYear ?? '', currentFl ?? '', currentYrFl ?? ''].filter((role) => role !== ''));

		return;
	}

	const { year, filiere: fl, year_filiere: yr_fl } = flGrpYr(member.roles.cache);
	if (!fl || !year || !yr_fl) return;
	if (year.name === '3A') {
		let yr_fl_new = yr_fl.name?.replace('3A', '2A');
		if (yr_fl_new) yr_fl_new = roles.get(yr_fl_new);
		const prevYear = roles.get('2A');

		await member.roles.add([prevYear ?? '', yr_fl.id].filter((x) => x !== ''));
		await member.roles.remove([year.id, yr_fl_new ?? ''].filter((x) => x !== ''));
	} else if (year.name === '2A') {
		let yr_fl_new = yr_fl.name?.replace('2A', '1A');
		if (yr_fl_new) yr_fl_new = roles.get(yr_fl_new);
		const prevYear = roles.get('1A');

		await member.roles.add([prevYear ?? '', yr_fl.id].filter((x) => x !== ''));
		await member.roles.remove([year.id, yr_fl_new ?? ''].filter((x) => x !== ''));
	}
}
