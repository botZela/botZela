import { ActivityType, ChannelType } from 'discord.js';
import mongoose, { ConnectOptions } from 'mongoose';
import { client } from '../..';
import { Event } from '../../Structures';

function presenceUpdate() {
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

const defaultExport: Event<'ready'> = {
	name: 'ready',
	execute: async () => {
		const { user } = client;
		user?.setPresence({
			activities: [
				{
					name: "with WHAT'S N3XT ©️",
					type: ActivityType.Watching,
				},
			],
			status: 'online',
		});
		console.log(`[INFO] Ready! Logged in as ${user?.tag ?? 'BOT'}`);

		// Presence ( online dnd offline ) for ensias guild
		presenceUpdate();

		// The connection to the Database(MongoDB)
		if (!process.env.DatabaseUri) return console.log('[INFO] -----------------');
		try {
			await mongoose.connect(process.env.DatabaseUri, {
				keepAlive: true,
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as ConnectOptions);
			console.log('[INFO] The Client is now connected to the DataBase.');
		} catch (err) {
			console.log('[ERROR] The Client did not connect to the DataBase Please Check the DatabaseUri.');
		}
		console.log('[INFO] -----------------');
	},
};

export default defaultExport;
