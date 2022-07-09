import mongoose, { ConnectOptions } from 'mongoose';
import { client } from '../..';
import guildDrive from '../../Models/guildDrive';
import { Event } from '../../Structures';

const defaultExport: Event<'ready'> = {
	name: 'ready',
	execute: async () => {
		const { user } = client;
		user?.setPresence({
			activities: [
				{
					name: "with WHAT'S N3XT ©️",
					type: 'WATCHING',
				},
			],
			status: 'online',
		});
		console.log(`[INFO] Ready! Logged in as ${user?.tag ?? 'BOT'}`);

		// The connection to the Database(MongoDB)
		if (!process.env.DatabaseUri) return console.log('[INFO] -----------------');
		try {
			await mongoose.connect(process.env.DatabaseUri, {
				keepAlive: true,
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as ConnectOptions);
			console.log('[INFO] The Client is now connected to the DataBase.');
			/**
			 * fetching messages that are registered in the guildDrive Model
			 */
			const docs = await guildDrive.find({});
			for (const doc of docs) {
				client.channels
					.fetch(doc.channelId)
					.then((channel) => {
						if (channel?.isText())
							channel.messages.fetch(doc.messageId).catch(() => {
								doc.delete();
							});
					})
					.catch(console.error);
			}
		} catch (err) {
			console.log('[ERROR] The Client did not connect to the DataBase Please Check the DatabaseUri.');
		}
		console.log('[INFO] -----------------');
	},
};

export default defaultExport;
