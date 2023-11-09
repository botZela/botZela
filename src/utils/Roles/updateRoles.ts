import type { GuildMember } from 'discord.js';
import guildRoles from '../../Models/guildRoles';
import { flGrpYr } from '../Schedule/flGrp';

export async function updateRole(member: GuildMember) {
	if (member.user.bot) return;
	if (member.user.id === member.guild.ownerId) return;
	const { year, filiere: fl, groupe, year_filiere: yr_fl } = flGrpYr(member.roles.cache);
	if (!fl || !year || !yr_fl) return;
	const guildData = await guildRoles.findOne({ guildId: member.guild.id });
	if (!guildData) return;

	const roles = guildData.roles;
	if (year.name === '3A') {
		const roleFiliereId = roles.get(`L_${fl.name ?? ''}`);
		const roleLaureatId = roles.get('Laureate');

		const promo = new Date().getFullYear().toString();
		const rolePromoId = roles.get(promo);

		await member.roles.add([rolePromoId ?? '', roleLaureatId ?? '', roleFiliereId ?? ''].filter((role) => role !== ''));

		const currentFl = roles.get(`_${fl.name ?? ''}_`);
		await member.roles.remove([year.id, currentFl ?? '', yr_fl.id].filter((role) => role !== ''));
	} else if (year.name === '2A') {
		const nextYrFl = roles.get(yr_fl.name?.replace('2A', '3A') ?? '');
		const nextYear = roles.get('3A');

		if (nextYear && nextYrFl) await member.roles.add([nextYear, nextYrFl]);
		await member.roles.remove(year.id);
	} else {
		const nextYrFl = roles.get(yr_fl.name?.replace('1A', '2A') ?? '');
		const nextYear = roles.get('2A');

		const currentGroupe = groupe?.name ? roles.get(groupe.name) : '';
		if (nextYear && nextYrFl) await member.roles.add([nextYear, nextYrFl]);
		await member.roles.remove([year.id, currentGroupe ?? ''].filter((role) => role !== ''));
	}
}
