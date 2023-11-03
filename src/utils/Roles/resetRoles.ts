import type { GuildMember } from 'discord.js';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { Person } from '../../OtherModules/Member';

export async function resetRoles(member: GuildMember, sheetOrArray: GSpreadSheet | Person[], index?: number) {
	if (member.user.bot) return;
	if (member.id === member.guild.ownerId) return;
	const { user, guild } = member;
	let newMem: Person | null;
	let ind = index;

	if (sheetOrArray instanceof GSpreadSheet) {
		if (!ind) {
			ind = await sheetOrArray.findCellCol(`${user.tag}`, 'F');
			if (ind === 0) {
				ind = await sheetOrArray.findCellCol(`${user.id}`, 'G');
				if (ind === 0) {
					return;
				}

				await sheetOrArray.updateCell(`F${ind}`, `${user.tag}`);
			}

			await sheetOrArray.updateCell(`G${ind}`, `${member.id}`);
		}

		newMem = await Person.create(ind, guild, sheetOrArray);
	} else {
		if (ind === undefined) {
			ind = sheetOrArray.map((pers) => pers.discordId).indexOf(member.id);
			if (ind === -1) {
				ind = sheetOrArray.map((pers) => pers.getDiscordUsername()).indexOf(member.user.tag);
			}
		}

		if (ind === -1) return;
		newMem = sheetOrArray[ind];
	}

	await member.setNickname(newMem.nickName);
	await member.roles.remove(member.roles.cache);
	await member.roles.add(newMem.rolesId);
}
