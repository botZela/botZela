/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Collection } from 'discord.js';
import type { Client } from '../Structures';
import type { IButtonCommand } from '../Typings';
import { importFile } from '../utils/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function buttonHandler(client: Client, PG: any, Ascii: any): Promise<void> {
	const Table = new Ascii('Buttons Handled');

	// eslint-disable-next-line n/no-path-concat
	const buttonsFolder: string[] = await PG(`${__dirname}/../Interactions/Buttons/**/*.{ts,js}`);
	if (!buttonsFolder.length) return;

	let count = 0;
	for (const file of buttonsFolder) {
		const buttonFile: IButtonCommand = await importFile(file);
		if (!buttonFile.id) {
			Table.addRow(
				`${file.split('/').at(-1)?.slice(0, -3)}`,
				`⛔ Button ID is missing: ${file.split('/').at(-2)}/${file.split('/').at(-1)}`,
			);
			continue;
		}

		if (buttonFile.cooldown) {
			client.buttonsCooldown.set(buttonFile.id, new Collection());
		}

		client.buttons.set(buttonFile.id, buttonFile);
		Table.addRow(buttonFile.id, '🔷 LOADED');
		count++;
	}

	if (client.showTable === true) {
		Table.sortColumn(1);
		console.log(Table.toString());
	} else if (client.showTable === 'both') {
		Table.sortColumn(1);
		console.log(Table.toString());
		console.log(`[INFO] Loaded ${count}/${buttonsFolder.length} Buttons.`);
	} else {
		console.log(`[INFO] Loaded ${count}/${buttonsFolder.length} Buttons.`);
	}
}
