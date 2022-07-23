import { GuildMember } from 'discord.js';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { Person } from '../../OtherModules/Member';

export async function resetRoles(member: GuildMember, sheetOrArray: GSpreadSheet | Person[], index?: number) {
	if (member.user.bot) return;
	if (member.id === member.guild.ownerId) return;
	const { user, guild } = member;
	if (sheetOrArray instanceof GSpreadSheet) {
		if (!index) {
			index = await sheetOrArray.findCellCol(`${user.tag}`, 'F');
			if (index === 0) {
				index = await sheetOrArray.findCellCol(`${user.id}`, 'G');
				if (index === 0) {
					return;
				}
				await sheetOrArray.updateCell(`F${index}`, `${user.tag}`);
			}
			await sheetOrArray.updateCell(`G${index}`, `${member.id}`);
		}
		const newMem = await Person.create(index, guild, sheetOrArray);
		const nickName = newMem.nickName;
		await member.setNickname(nickName);
		await member.roles.remove(member.roles.cache);
		await member.roles.add(newMem.rolesId);
	} else {
		if (index === undefined) {
			index = sheetOrArray.map((pers) => pers.discordId).indexOf(member.id);
			if (index === -1) {
				index = sheetOrArray.map((pers) => pers.getDiscordUsername()).indexOf(member.user.tag);
			}
		}
		if (index === -1) return;
		const newMem = sheetOrArray[index];
		const nickName = newMem.nickName;
		await member.setNickname(nickName);
		await member.roles.remove(member.roles.cache);
		await member.roles.add(newMem.rolesId);
	}
}
