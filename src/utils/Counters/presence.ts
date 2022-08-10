import { ChannelType } from 'discord.js';
import { client } from '../..';

export function presenceUpdate() {
	client.channels
		.fetch('1000733341529673728')
		.then((presChannel) => {
			if (!presChannel || presChannel.type !== ChannelType.GuildVoice) return;
			const guild = presChannel.guild;
			const totalMembers = guild.members.cache.size;
			const onlineMembers = guild.members.cache.filter((m) => m.presence?.status === 'online').size;
			const idleMembers = guild.members.cache.filter((m) => m.presence?.status === 'idle').size;
			const dndMembers = guild.members.cache.filter((m) => m.presence?.status === 'dnd').size;
			const offlineMembers = totalMembers - onlineMembers - idleMembers - dndMembers;
			const online = `🟢 ${onlineMembers}`;
			const idle = `🌙 ${idleMembers}`;
			const dnd = `⛔ ${dndMembers}`;
			const offline = `⚫ ${offlineMembers}`;
			presChannel
				.edit({ name: `${online} ${idle} ${dnd} ${offline}` })
				.then(() => {
					setTimeout(presenceUpdate, 6 * 60 * 1000);
				})
				.catch(console.error);
		})
		.catch((e) => {
			throw e;
		});
}
