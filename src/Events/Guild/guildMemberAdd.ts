import linksModel from '../../Models/guildLinks';
import gRoles from '../../Models/guildRoles';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { Person } from '../../OtherModules/Member';
import { Event } from '../../Structures';
import { welcomeMsg, kick } from '../../utils/Guild';
import { logsMessage } from '../../utils/logsMessage';

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
				logs = `[INFO] .${user.tag} has got [Bots] role.`;
				await logsMessage(logs, guild);
				await member.roles.add(guildRoles.get('Bots') ?? '');
				return;
			}
			let index = await activeSheet.findCellCol(`${user.tag}`, 'F');
			if (index === 0) {
				index = await activeSheet.findCellCol(`${user.id}`, 'G');
				if (index === 0) {
					await kick(member, guild);
					logs = `[INFO] .${user.tag} got kicked from the server`;
					await logsMessage(logs, guild);
					return;
				}
				await activeSheet.updateCell(`F${index}`, `${user.tag}`);
			}
			await activeSheet.updateCell(`G${index}`, `${member.id}`);
			if (member.pending) return;
			const newMem = await Person.create(index, guild, activeSheet);
			newMem.discordId = member.id;
			await member.setNickname(newMem.nickName);
			logs = `[INFO] .${user.toString()} nickname changed to ${newMem.nickName ?? user.tag}`;
			await member.roles.add(newMem.rolesId);
			await activeSheet.colorRow(index, '#F9BB03');
			logs += `\n[INFO] .${member.nickname ?? user.tag} got Roles ${JSON.stringify(newMem.rolesNames)}`;
			await logsMessage(logs, guild);
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
