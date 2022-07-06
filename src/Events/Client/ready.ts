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
					name: 'Typescript',
					type: 'LISTENING',
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
		} catch (err) {
			console.log('[ERROR] The Client did not connect to the DataBase Please Check the DatabaseUri.');
		}
		console.log('[INFO] -----------------');
	},
};

export default defaultExport;
