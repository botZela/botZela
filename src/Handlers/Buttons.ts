import { Collection } from 'discord.js';
import { Client } from '../Structures';
import { IButtonCommand } from '../Typings';
import { importFile } from '../utils';

export async function buttonHandler(client: Client, PG: any, Ascii: new (arg0: string) => any): Promise<void> {
	const Table = new Ascii('Buttons Handled');

	const buttonsFolder = await PG(`${__dirname}/../Interactions/Buttons/**/*.{ts,js}`);
	if (!buttonsFolder.length) return;

	let count = 0;
	for (let file of buttonsFolder) {
		const buttonFile: IButtonCommand = await importFile(file);
		if (!buttonFile.id) {
			await Table.addRow(
				`${file.split('/').at(-1).slice(0, -3)}`,
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
