import { ActivityType } from 'discord.js';
import mongoose, { ConnectOptions } from 'mongoose';
import { client } from '../..';
import { Event } from '../../Structures';

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
		// presenceUpdate();

		// The connection to the Database(MongoDB)
		if (!process.env.DatabaseUri) return console.log('[INFO] -----------------');
		try {
			await mongoose.connect(process.env.DatabaseUri, {
				keepAlive: true,
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as ConnectOptions);
			mongoose.set('strictQuery', false);
			console.log('[INFO] The Client is now connected to the DataBase.');
		} catch (err) {
			console.log('[ERROR] The Client did not connect to the DataBase Please Check the DatabaseUri.');
		}
		console.log('[INFO] -----------------');
	},
};

export default defaultExport;
