import linksModel from '../../Models/guildLinks';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet';
import type { Event } from '../../Structures';
import { logsEmbed } from '../../utils';

const defaultExport: Event<'guildMemberRemove'> = {
	name: 'guildMemberRemove',
	async execute(member) {
		const { guild, user } = member;
		const worksheetUrl = (await linksModel.findOne({ guildId: guild.id }))?.spreadsheet;
		let logs = '';
		if (!worksheetUrl) {
			console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
			logs = `${user.tag} Left the server`;
			await logsEmbed(logs, guild, 'error');
			return;
		}

		try {
			const activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, 0);
			if (user.bot) {
				logs = `${user.tag} is gone from the server.`;
				await logsEmbed(logs, guild, 'warn');
				return;
			}

			let index = await activeSheet.findCellCol(`${user.tag}`, 'F');
			if (index === 0) {
				index = await activeSheet.findCellCol(`${user.id}`, 'G');
				if (index === 0) {
					logs = `${user.tag} did not fill the form.`;
					await logsEmbed(logs, guild, 'warn');
					return;
				}

				await activeSheet.updateCell(`F${index}`, `${user.tag}`);
			}

			await activeSheet.updateCell(`G${index}`, `${member.id}`);
			await activeSheet.colorRow(index, '#FF00FF');
			logs = `${member.nickname ?? member.user.tag} Left the server`;
			await logsEmbed(logs, guild, 'warn');
		} catch {
			console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
			logs = `[INFO] .${member.nickname ?? member.user.tag} Left the server`;
			await logsEmbed(logs, guild, 'info');
		}
	},
};

export default defaultExport;
