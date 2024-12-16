import type { ClientEvents } from 'discord.js';
import type { Client, Event } from '../Structures';
import { Events } from '../Validation';
import { importFile } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function eventHandler(client: Client, PG: any, Ascii: any): Promise<void> {
	const Table = new Ascii('Events Loaded');

	const eventFiles: string[] = await PG(`${__dirname}/../Events/**/*.{ts,js}`);
	if (!eventFiles.length) return;

	let count = 0;
	for (const file of eventFiles) {
		const event: Event<keyof ClientEvents> = await importFile(file);
		if (!Events.includes(event.name)) {
			await Table.addRow(`⛔ Event name is  invalid : ${file.split('/').at(-2)}/${file.split('/').at(-1)}`);
			continue;
		}

		if (event.once) {
			client.once(event.name, async (...args) => event.execute(...args));
		} else {
			client.on(event.name, async (...args) => event.execute(...args));
		}

		await Table.addRow(event.alias ?? event.name, '🟢 SUCCESSFUL');
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
