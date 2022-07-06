import { CommandInteraction, Message } from 'discord.js';
import { createEmbed } from '../';
import { client } from '../..';
import linksModel from '../../Models/guildLinks';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet/gsp';

export async function checkSpreadsheet(message: Message | CommandInteraction, link: string): Promise<void> {
	const { guild } = message;
	if (message instanceof CommandInteraction) {
		if (!message.channel) {
			await message.reply({
				content: "Can't use this outside a guild",
			});
			return;
		}
	}
	if (!client.user) {
		return;
	}
	if (!guild) {
		await message.channel?.send({
			content: "Can't use this outside a guild",
		});
		return;
	}

	try {
		const testSheet = await GSpreadSheet.createFromUrl(link, './credentials/google_account.json', 0);
		if (await testSheet.check()) {
			const wsData = await linksModel.findOne({ guildId: guild.id });
			if (wsData) {
				wsData.spreadsheet = link;
				await wsData.save();
			} else {
				await linksModel.create({
					guildId: guild.id,
					guildName: guild.name,
					spreadsheet: link,
				});
			}
			const embed = createEmbed(
				"Setup Spreadsheet's link",
				`${client.user.tag} has connected successfully to the SpreadSheet`,
			);
			await message.channel?.send({ embeds: [embed] });
			console.log(
				`[INFO] ${client.user.tag} has connected successfully to the SpreadSheet of guild ${guild.name}.\n${link}`,
			);
			return;
		}
		const embed = createEmbed(
			"Setup Spreadsheet's link",
			`${client.user.tag} has connected successfully to the SpreadSheet, but spreadsheet's columns do not match with ours:\n["Timestamp", "First Name", "Last Name", "Email", "Phone Number", "Discord Username", "ID Discord"]`,
		);
		await message.channel?.send({ embeds: [embed] });
		return;
	} catch (e) {
		console.log(`[INFO] Can't access the url of guild ${guild.name}.`);
		const gspBotMail = 'rolebot@woven-justice-335518.iam.gserviceaccount.com';
		const embed1 = createEmbed("Setup Spreadsheet's link", "**Can't access the url**");
		const embed2 = createEmbed(
			"Setup Spreadsheet's link",
			`**After Sharing your SpreadSheet with this account :\n\n__${gspBotMail}__**\n\nReuse the command.\`/setup link spreadsheet <spreadsheet_link>\``,
		);
		await message.channel?.send({ embeds: [embed1, embed2] });
	}
}
