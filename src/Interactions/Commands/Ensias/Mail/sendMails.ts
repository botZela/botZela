import fs from 'node:fs/promises';
import process from 'node:process';
import { client } from '../../../..';
import linksModel from '../../../../Models/guildLinks';
import { GSpreadSheet } from '../../../../OtherModules/GSpreadSheet';
import { titleCase } from '../../../../OtherModules/Member/stringFunc';
import type { ICommand } from '../../../../Typings';
import { createErrorEmbed, logsEmbed } from '../../../../utils';
import { sendMail } from '../../../../utils/Mail/sendMail';

const defaultExport: ICommand = {
	name: 'mail',
	description: 'Sends a mail to people who filled the form',
	defaultMemberPermissions: ['Administrator'],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	async execute({ interaction }) {
		await interaction.deferReply();
		const { guild } = interaction;
		if (!guild) {
			const embed = createErrorEmbed('Mailing Service', 'This command is used inside a server ...');
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}

		const worksheetUrl = (await linksModel.findOne({ guildId: guild.id }))?.spreadsheet;
		if (!worksheetUrl) {
			const embed = createErrorEmbed('Mailing Service', 'Consider filling the spreadsheet url ...');
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}

		try {
			const activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, 0);
			const members = (await activeSheet.getAllDict()).filter(
				(row) => ['FALSE', ''].includes(row.get('Mailed') as string) && row.get('ID Discord') === '',
			);

			const htmlText = await fs.readFile(`${process.cwd()}/templates/mail.html`, 'utf8');
			const colInd = activeSheet.getColIndDict('Mailed');
			for (const member of members) {
				const fname = (member.get('First Name') as string).trim();
				const lname = (member.get('Last Name') as string).trim();
				const email = (member.get('Email') as string).trim();
				const index = member.get('index') as number;
				if (!fname || !lname || !email || !index) continue;
				const nickname = `${titleCase(fname)} ${lname.toUpperCase()}`;
				const to_send = htmlText.replace('%%nickname%%', nickname);
				await sendMail(email, '🔺ENSIAS🔺DISCORD Server', to_send, 'Welcome to ENSIAS');
				const cell = activeSheet.getCellRefFromIndex(index, colInd);
				await Promise.all([activeSheet.updateCell(cell, 'TRUE'), activeSheet.colorRow(index, '#44bcc5')]);
			}

			await interaction.followUp({
				content: `Emailed ${members.length} Person`,
			});
			const toLog = `Emailed ${members.length} Person`;
			await logsEmbed(toLog, guild, 'info');
		} catch (error) {
			console.error(error);
		}
	},
};

export default defaultExport;
