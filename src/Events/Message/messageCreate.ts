import { DMChannel, NewsChannel, PartialDMChannel, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { introduceYourSelf, announcements } from '../../utils/AutoReacts';
import { messageSchedule } from '../../utils/Schedule/autoResponceSchedule';

export default {
	name: 'messageCreate',
	async execute(message) {
		const SUPPORTED_GUILDS = client.testGuilds.map((guild) => guild.id);
		const { channel, author, guild } = message;
		if (
			channel instanceof TextChannel ||
			channel instanceof VoiceChannel ||
			channel instanceof ThreadChannel ||
			channel instanceof NewsChannel
		) {
			let announcementName = 'announcement';
			let introduceName = 'introd';
			let emploiName = '『📅』get-schedule';
			if (!guild || !SUPPORTED_GUILDS.includes(`${message.guildId}`)) {
				return;
			} else if (channel.name.includes(announcementName)) {
				if (author.bot) return;
				await announcements(message);
			} else if (channel.name.includes(introduceName)) {
				if (author.bot) return;
				await introduceYourSelf(message);
			} else if (channel.name.includes(emploiName)) {
				if (author.bot || guild.id != client.testGuilds[0].id) return;
				messageSchedule(message);
			}
			if (message.content.startsWith('test')) {
				// await message.reply(`Presence \`${guild.maximumPresences}\`, Memebers: \`${guild.maximumMembers}\``);
				const totalMembers = guild.members.cache.size;
				const onlineMembers = guild.members.cache.filter((m) => m.presence?.status === 'online').size;
				const idleMembers = guild.members.cache.filter((m) => m.presence?.status === 'idle').size;
				const dndMembers = guild.members.cache.filter((m) => m.presence?.status === 'dnd').size;
				const offlineMembers = totalMembers - onlineMembers - idleMembers - dndMembers;
				const online = `🟢 ${onlineMembers}`;
				const idle = `🌙 ${idleMembers}`;
				const dnd = `⛔ ${dndMembers}`;
				const offline = `⚫ ${offlineMembers}`;
				await message.reply(`${online} ${idle} ${dnd} ${offline}`);
			}
		}
	},
} as Event<'messageCreate'>;
