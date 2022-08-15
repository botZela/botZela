import linksModel from '../../Models/guildLinks';
import gRoles from '../../Models/guildRoles';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { Person } from '../../OtherModules/Member';
import { Event } from '../../Structures';
import { welcomeMsg, kick } from '../../utils/Guild';
import { logsEmbed } from '../../utils/Logger';

const defaultExport: Event<'guildMemberAdd'> = {
	name: 'guildMemberAdd',
	async execute(member) {
		const { guild, user } = member;
		const guildRoles = (await gRoles.findOne({ guildId: guild.id }))?.roles;
		const worksheetUrl = (await linksModel.findOne({ guildId: guild.id }))?.spreadsheet;
		let logs;
		if (!worksheetUrl || !guildRoles) {
			if (guild.systemChannel) {
				if (member.pending) return;
				const toSend = await welcomeMsg(member);
				await guild.systemChannel.send(toSend);
			}
			if (!worksheetUrl) return console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
			if (!guildRoles) return console.log(`[INFO] Roles are not defined for server ${guild.name}`);
		}
		try {
			const gAccPath = `${process.cwd()}/credentials/google_account.json`;
			const activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, gAccPath, 0);
			if (user.bot) {
				const botRole = guildRoles.get('Bots');
				if (!botRole) return;
				logs = `%user% has got <@&${botRole}> role.`;
				await logsEmbed(logs, guild, 'info', member);
				await member.roles.add(botRole);
				return;
			}
			let index = await activeSheet.findCellCol(`${user.tag}`, 'F');
			if (index === 0) {
				index = await activeSheet.findCellCol(`${user.id}`, 'G');
				if (index === 0) {
					await kick(member, guild);
					logs = `${user.tag} got kicked from the server`;
					await logsEmbed(logs, guild, 'warn');
					return;
				}
				await activeSheet.updateCell(`F${index}`, `${user.tag}`);
			}
			await activeSheet.updateCell(`G${index}`, `${member.id}`);
			if (member.pending) return;
			const newMem = await Person.create(index, guild, activeSheet);
			newMem.discordId = member.id;
			await member.setNickname(newMem.nickName);
			logs = `%user% nickname changed to __${newMem.nickName ?? user.tag}__`;
			await member.roles.add(newMem.rolesId);
			await activeSheet.colorRow(index, '#F9BB03');
			logs += `\n%user% got Roles ${newMem.rolesId.map((role) => `<@&${role}>`).join(' ')}`;
			await logsEmbed(logs, guild, 'info', member);
		} catch (e) {
			console.error(e);
			console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
		}
		if (guild.systemChannel) {
			if (member.pending) return;
			const toSend = await welcomeMsg(member);
			await guild.systemChannel.send(toSend);
		}
	},
};

export default defaultExport;
