import type { Event } from '../../Structures';
import { autoReact } from '../../utils/AutoReacts/autoReact.js';
import { announcements, introduceYourSelf } from '../../utils/AutoReacts/index.js';

const defaultExport: Event<'messageCreate'> = {
	name: 'messageCreate',
	async execute(message) {
		await autoReact(message);
		if (message.inGuild()) {
			const { channel, author, guild } = message;
			const announcementName = 'announcement';
			const introduceName = 'introd';
			if (channel.name.includes(announcementName)) {
				if (author.bot) return;
				await announcements(message);
			} else if (channel.name.includes(introduceName)) {
				if (author.bot) return;
				await introduceYourSelf(message);
			}

			if (message.content.startsWith('test') && message.author.id === '381238047527927808') {
				const totalMembers = guild.members.cache.size;
				const onlineMembers = guild.members.cache.filter((msg) => msg.presence?.status === 'online').size;
				const idleMembers = guild.members.cache.filter((msg) => msg.presence?.status === 'idle').size;
				const dndMembers = guild.members.cache.filter((msg) => msg.presence?.status === 'dnd').size;
				const offlineMembers = totalMembers - onlineMembers - idleMembers - dndMembers;
				const online = `🟢 ${onlineMembers}`;
				const idle = `🌙 ${idleMembers}`;
				const dnd = `⛔ ${dndMembers}`;
				const offline = `⚫ ${offlineMembers}`;
				await message.reply(`${online} ${idle} ${dnd} ${offline}`);
			}
		}
	},
};

export default defaultExport;
