import { Client } from '../Structures';
import { ISelectMenuCommand } from '../Typings';
import { importFile } from '../utils';

export async function selectMenuHandler(client: Client, PG: any, Ascii: new (arg0: string) => any): Promise<void> {
	const Table = new Ascii('Selct Menu Handler');

	const selectMenuFiles = await PG(`${__dirname}/../Interactions/SelectMenu/**/*.ts`);
	if (!selectMenuFiles.length) return;

	let count = 0;
	for (let file of selectMenuFiles) {
		const selectMenu: ISelectMenuCommand = await importFile(file);
		if (!selectMenu.id) {
			await Table.addRow(
				`${file.split('/').at(-1).slice(0, -3)}`,
				`⛔ Select Menu ID is missing: ${file.split('/').at(-2)}/${file.split('/').at(-1)}`,
			);
			continue;
		}
		if (selectMenu.cooldown) {
			// client.buttonsCooldown.set(buttonFile.id, new Collection());
		}

		client.selectMenu.set(selectMenu.id, selectMenu);
		Table.addRow(selectMenu.id, '🔷 LOADED');
		count++;
	}

	if (client.showTable === true) {
		Table.sortColumn(1);
		console.log(Table.toString());
	} else if (client.showTable === 'both') {
		Table.sortColumn(1);
		console.log(Table.toString());
		console.log(`[INFO] Loaded ${count}/${selectMenuFiles.length} Select Menu Commands.`);
	} else {
		console.log(`[INFO] Loaded ${count}/${selectMenuFiles.length} Select Menu Commands.`);
	}
}