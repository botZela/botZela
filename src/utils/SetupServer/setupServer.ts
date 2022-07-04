import { GSpreadSheet } from '../../OtherModules/GSpreadSheet/gsp';
import { createEmbed } from '../createEmbed';
import linksModel from '../../Models/guildLinks';
import { Message } from 'discord.js';
import { client } from '../..';
import { ExtendedCommandInteraction } from '../../Typings';

export async function setupServer(message: Message | ExtendedCommandInteraction): Promise<void> {
	const { channel, guild } = message;
	if (!guild || !channel) {
		return;
	}
	console.log(`[INFO] Setup for guild ${guild.name}`);
	let gspBotMail = 'rolebot@woven-justice-335518.iam.gserviceaccount.com';

	function filter(m: Message) {
		return m.member?.id == message.member?.id;
	}
	let msg = '';
	while (msg != 'done') {
		let embed = createEmbed(
			'Setup Server',
			`**Please Share your SpreadSheet with this account :**\n\n**__${gspBotMail}__**\n\nSend **\"done\"** if fished.\nSend **\"cancel\"** to stop command.`,
		);
		await channel.send({ embeds: [embed] });
		try {
			let collected = await channel.awaitMessages({
				filter: filter,
				max: 1,
				time: 60000,
				errors: ['time'],
			});
			msg = collected.first()?.content.toLowerCase() ?? '';
			if (msg.toLowerCase() === 'cancel') {
				console.log(`[INFO] Setup Server command was canceled in server ${guild.name}`);
				let embed = createEmbed('Setup Server command was canceled');
				await channel.send({ embeds: [embed] });
				return;
			}
		} catch (e) {
			let embed = createEmbed('Bot timed Out !!');
			console.log(`[INFO] Bot timed out in server ${guild.name}`);
			await channel.send({ embeds: [embed] });
			return;
		}
	}
	while (true) {
		let embed = createEmbed('Setup Server', '**Please enter your sheet link**\n\nSend **"cancel"** to stop command.');
		await channel.send({ embeds: [embed] });
		try {
			let collected = await channel.awaitMessages({
				filter: filter,
				max: 1,
				time: 60000,
				errors: ['time'],
			});
			let sheetUrl = collected.first()?.content ?? '';
			if (sheetUrl.toLowerCase() === 'cancel') {
				console.log(`[INFO] Setup Server command was canceled in server ${guild.name}`);
				let embed = createEmbed('Setup Server command was canceled');
				await channel.send({ embeds: [embed] });
				return;
			}
			console.log(`[INFO] SpreadSheet URL of guild ${guild.name}.\n${sheetUrl}`);
			let testSheet = GSpreadSheet.createFromUrl(sheetUrl, './credentials/google_account.json', 0);
			try {
				if (await (await testSheet).check()) {
					const wsData = await linksModel.findOne({ guildId: guild.id });
					if (wsData) {
						wsData.spreadsheet = sheetUrl;
						await wsData.save();
					} else {
						await linksModel.create({
							guildId: guild.id,
							guildName: guild.name,
							url: sheetUrl,
						});
					}
					let embed = createEmbed('Setup Server', `${client.user?.tag} has connected successfully to the SpreadSheet`);
					await channel.send({ embeds: [embed] });
					console.log(
						`[INFO] ${client.user?.tag} has connected successfully to the SpreadSheet of guild ${guild.name}.`,
					);
					break;
				}
			} catch (e) {
				let embed = createEmbed('Setup Server', "**Can't access the url**");
				await channel.send({ embeds: [embed] });
				console.log(`[INFO] Can't access the url of guild ${guild.name}.`);
			}
		} catch (e) {
			let embed = createEmbed('Bot timed Out !!!');
			console.log(`[INFO] Bot timed out in server ${guild.name}`);
			await channel.send({ embeds: [embed] });
			break;
		}
	}
}
