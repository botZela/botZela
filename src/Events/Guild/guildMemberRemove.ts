import linksModel from '../../Models/guildLinks';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import { Event } from '../../Structures';
import { logsMessage } from '../../utils';

const defaultExport: Event<'guildMemberRemove'> = {
	name: 'guildMemberRemove',
	async execute(member) {
		const { guild, user } = member;
		const worksheetUrl = (await linksModel.findOne({ guildId: guild.id }))?.spreadsheet;
		let logs = '';
		if (!worksheetUrl) {
			console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
			logs = `[INFO] .${member.nickname ?? member.user.tag} Left the server`;
			await logsMessage(logs, guild);
			return;
		}
		try {
			const gAccPath = `${process.cwd()}/credentials/google_account.json`;
			const activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, gAccPath, 0);
			if (user.bot) {
				logs = `[INFO] .${user.tag} is gone from the server.`;
				await logsMessage(logs, guild);
				return;
			}
			let index = await activeSheet.findCellCol(`${user.tag}`, 'F');
			if (index === 0) {
				index = await activeSheet.findCellCol(`${user.id}`, 'G');
				if (index === 0) {
					logs = `[INFO] .${user.tag} did not fill the form.`;
					await logsMessage(logs, guild);
					return;
				}
				await activeSheet.updateCell(`F${index}`, `${user.tag}`);
			}
			await activeSheet.updateCell(`G${index}`, `${member.id}`);
			await activeSheet.colorRow(index, '#FF00FF');
			logs = `[INFO] .${member.nickname ?? member.user.tag} Left the server`;
			await logsMessage(logs, guild);
		} catch (e) {
			console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
			logs = `[INFO] .${member.nickname ?? member.user.tag} Left the server`;
			await logsMessage(logs, guild);
		}
	},
};

export default defaultExport;
