import { setTimeout } from 'node:timers';
import { ChannelType } from 'discord.js';
import { client } from '../../index.js';

export async function presenceUpdate() {
	const presChannel = await client.channels.fetch('1000733341529673728');
	if (!presChannel || presChannel.type !== ChannelType.GuildVoice) return;
	const guild = presChannel.guild;
	const totalMembers = guild.members.cache.size;
	const onlineMembers = guild.members.cache.filter((msg) => msg.presence?.status === 'online').size;
	const idleMembers = guild.members.cache.filter((msg) => msg.presence?.status === 'idle').size;
	const dndMembers = guild.members.cache.filter((msg) => msg.presence?.status === 'dnd').size;
	const offlineMembers = totalMembers - onlineMembers - idleMembers - dndMembers;
	const online = `🟢 ${onlineMembers}`;
	const idle = `🌙 ${idleMembers}`;
	const dnd = `⛔ ${dndMembers}`;
	const offline = `⚫ ${offlineMembers}`;
	try {
		await presChannel.edit({ name: `${online} ${idle} ${dnd} ${offline}` });
		setTimeout(presenceUpdate, 6 * 60 * 1_000);
	} catch (error) {
		console.error(error);
	}
}
