/* eslint-disable no-await-in-loop */
import type { Message } from 'discord.js';
import { client } from '../..';
import linksModel from '../../Models/guildLinks';
import { GSpreadSheet } from '../../OtherModules/GSpreadSheet/gsp';
import type { ExtendedCommandInteraction } from '../../Typings';
import { createEmbed } from '../Embeds';

export async function setupServer(message: ExtendedCommandInteraction | Message): Promise<void> {
	const { channel, guild } = message;
	if (!guild || !channel) {
		return;
	}

	console.log(`[INFO] Setup for guild ${guild.name}`);
	const gspBotMail = 'rolebot@woven-justice-335518.iam.gserviceaccount.com';

	function filter(msg: Message) {
		return msg.member?.id === message.member?.id;
	}

	let msg = '';
	while (msg !== 'done') {
		const embed = createEmbed(
			'Setup Server',
			`**Please Share your SpreadSheet with this account :**\n\n**__${gspBotMail}__**\n\nSend **"done"** if fished.\nSend **"cancel"** to stop command.`,
		);
		await channel.send({ embeds: [embed] });
		try {
			const collected = await channel.awaitMessages({
				filter,
				max: 1,
				time: 60_000,
				errors: ['time'],
			});
			msg = collected.first()?.content.toLowerCase() ?? '';
			if (msg.toLowerCase() === 'cancel') {
				console.log(`[INFO] Setup Server command was canceled in server ${guild.name}`);
				const embed = createEmbed('Setup Server command was canceled');
				await channel.send({ embeds: [embed] });
				return;
			}
		} catch {
			const embed = createEmbed('Bot timed Out !!');
			console.log(`[INFO] Bot timed out in server ${guild.name}`);
			await channel.send({ embeds: [embed] });
			return;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		const embed = createEmbed('Setup Server', '**Please enter your sheet link**\n\nSend **"cancel"** to stop command.');
		await channel.send({ embeds: [embed] });
		try {
			const collected = await channel.awaitMessages({
				filter,
				max: 1,
				time: 60_000,
				errors: ['time'],
			});
			const sheetUrl = collected.first()?.content ?? '';
			if (sheetUrl.toLowerCase() === 'cancel') {
				console.log(`[INFO] Setup Server command was canceled in server ${guild.name}`);
				const embed = createEmbed('Setup Server command was canceled');
				await channel.send({ embeds: [embed] });
				return;
			}

			console.log(`[INFO] SpreadSheet URL of guild ${guild.name}.\n${sheetUrl}`);
			const testSheet = await GSpreadSheet.createFromUrl(sheetUrl, 0);
			try {
				if (testSheet.check()) {
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

					const embed = createEmbed(
						'Setup Server',
						`${client.user?.tag ?? 'Bot'} has connected successfully to the SpreadSheet`,
					);
					await channel.send({ embeds: [embed] });
					console.log(
						`[INFO] ${client.user?.tag ?? 'Bot'} has connected successfully to the SpreadSheet of guild ${guild.name}.`,
					);
					break;
				}
			} catch {
				const embed = createEmbed('Setup Server', "**Can't access the url**");
				await channel.send({ embeds: [embed] });
				console.log(`[INFO] Can't access the url of guild ${guild.name}.`);
			}
		} catch {
			const embed = createEmbed('Bot timed Out !!!');
			console.log(`[INFO] Bot timed out in server ${guild.name}`);
			await channel.send({ embeds: [embed] });
			break;
		}
	}
}
