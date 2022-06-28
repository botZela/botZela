import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { Person } from '../../OtherModules/Member';
import { logsMessage } from '../../utils/logsMessage';
import { welcomeMsg, kick } from '../../utils/Guild';

// Models
import gRoles from '../../Models/guildRoles';
import linksModel from '../../Models/guildLinks';
import { Event } from '../../Structures';

const PRV_ROLES = {
	'921408078983876678': {
		Admin: '921522743604813874',
	},
};

const ADMINS = ['892346084913975307', '381238047527927808'];

export default {
	name: 'guildMemberAdd',
	async execute(member) {
		const { guild, user } = member;
		const guildRoles = (await gRoles.findOne({ guildId: guild.id })).roles;
		const worksheetUrl = (await linksModel.findOne({ guildId: guild.id }))?.spreadsheet;
		let logs;
		if (!worksheetUrl) {
			if (guild.systemChannel) {
				let toSend = await welcomeMsg(member);
				guild.systemChannel.send(toSend);
			}
			return console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
		}
		try {
			let gAccPath = `${process.cwd()}/credentials/google_account.json`;
			let activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, gAccPath, 0);
			if (user.bot) {
				logs = `[INFO] .${user.tag} has got [Bots] role.`;
				await logsMessage(logs, guild);
				await member.roles.add(guildRoles.get('Bots'));
				return;
			}
			let index = await activeSheet.findCellCol(`${user.tag}`, 'F');
			if (index == 0) {
				index = await activeSheet.findCellCol(`${user.id}`, 'G');
				if (index == 0) {
					await kick(member, guild);
					logs = `[INFO] .${user.tag} got kicked from the server`;
					await logsMessage(logs, guild);
					return;
				}
				await activeSheet.updateCell(`F${index}`, `${user.tag}`);
			}
			await activeSheet.updateCell(`G${index}`, `${member.id}`);
			let newMem = await Person.create(index, guild, activeSheet);
			let nickName = newMem.nickName;
			await member.setNickname(nickName);
			logs = `[INFO] .${user.tag} nickname changed to ${nickName}`;
			// Only ENSIAS SERVER
			if (guild.id == '921408078983876678' && ADMINS.includes(member.id)) {
				newMem.rolesId.push(PRV_ROLES[`${guild.id}`]['Admin']);
				newMem.rolesNames.push('Admin');
			}
			await member.roles.add(newMem.rolesId);
			await activeSheet.colorRow(index, '#F9BB03');
			logs += `\n[INFO] .${user.tag} got Roles [` + newMem.rolesNames.map((role) => `'${role}'`) + `]`;
			await logsMessage(logs, guild);
		} catch (e) {
			console.error(e);
			console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
		}
		if (guild.systemChannel) {
			let toSend = await welcomeMsg(member);
			guild.systemChannel.send(toSend);
		}
	},
} as Event<'guildMemberAdd'>;
