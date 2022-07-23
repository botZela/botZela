import { GuildMember } from 'discord.js';
import guildRoles from '../../Models/guildRoles';
import { flGrpYr } from '../Schedule/flGrp';

export async function updateRole(member: GuildMember) {
	if (member.user.bot) return;
	const { year, filiere: fl, groupe } = flGrpYr(member);
	if (!fl || !year) return;
	const guildData = await guildRoles.findOne({ guildId: member.guild.id });
	if (!guildData) return;

	const roles = guildData.roles;
	if (year === '3A') {
		const roleFiliereId = roles.get(`L_${fl}`);
		const roleLaureatId = roles.get('Laureate');

		const promo = new Date().getFullYear().toString();
		const rolePromoId = roles.get(promo);

		await member.roles.add([rolePromoId ?? '', roleLaureatId ?? '', roleFiliereId ?? ''].filter((role) => role !== ''));

		const currentYear = roles.get('3A');
		const currentFl = roles.get(`_${fl}_`);
		const currentGroupe = groupe ? roles.get(groupe) : '';
		await member.roles.remove([currentYear ?? '', currentFl ?? '', currentGroupe ?? ''].filter((role) => role !== ''));
	} else if (year === '2A') {
		const currentYear = roles.get('2A');
		const nextYear = roles.get('3A');

		if (nextYear) await member.roles.add(nextYear);
		if (currentYear) await member.roles.remove(currentYear);
	} else {
		const currentYear = roles.get('1A');
		const nextYear = roles.get('2A');

		if (nextYear) await member.roles.add(nextYear);
		if (currentYear) await member.roles.remove(currentYear);
	}
}
