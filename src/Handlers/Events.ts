import { Events } from '../Validation';
import { Client, Event } from '../Structures';
import { ClientEvents } from 'discord.js';
import { importFile } from '../utils';

export async function eventHandler(client: Client, PG: any, Ascii: new (arg0: string) => any): Promise<void> {
	const Table = new Ascii('Events Loaded');

	let eventFiles = await PG(`${__dirname}/../Events/**/*.{ts,js}`);
	if (!eventFiles.length) return;

	let count = 0;
	for (const file of eventFiles) {
		const event: Event<keyof ClientEvents> = await importFile(file);
		if (!Events.includes(event.name) || !event.name) {
			await Table.addRow(
				`${event.name || 'MISSING'}`,
				`⛔ Event name is either invalid or missing: ${file.split('/').at(-2)}/${file.split('/').at(-1)}`,
			);
			continue;
		}

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
		await Table.addRow(event?.alias || event.name, '🟢 SUCCESSFUL');
		count++;
	}

	if (client.showTable === true) {
		Table.sortColumn(1);
		console.log(Table.toString());
	} else if (client.showTable === 'both') {
		Table.sortColumn(1);
		console.log(Table.toString());
		console.log(`[INFO] Loaded ${count}/${eventFiles.length} Events.`);
	} else {
		console.log(`[INFO] Loaded ${count}/${eventFiles.length} Events.`);
	}
}
