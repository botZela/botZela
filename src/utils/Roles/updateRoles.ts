import type { GuildMember } from 'discord.js';
import guildRoles from '../../Models/guildRoles.js';
import { flGrpYr } from '../Schedule/flGrp.js';

export async function updateRole(member: GuildMember) {
	if (member.user.bot) return;
	const { year, filiere: fl, groupe } = flGrpYr(member);
	if (!fl || !year) return;
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
		await member.roles.remove([year.id, currentFl ?? ''].filter((role) => role !== ''));
	} else if (year.name === '2A') {
		const nextYear = roles.get('3A');

		if (nextYear) await member.roles.add(nextYear);
		await member.roles.remove(year.id);
	} else {
		const nextYear = roles.get('2A');

		const currentGroupe = groupe?.name ? roles.get(groupe.name) : '';
		if (nextYear) await member.roles.add(nextYear);
		await member.roles.remove([year.id, currentGroupe ?? '']);
	}
}
