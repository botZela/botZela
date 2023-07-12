/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Client } from '../Structures';
import type { IModalSubmitCommand } from '../Typings';
import { importFile } from '../utils/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function modalSubmitHandler(client: Client, PG: any, Ascii: any): Promise<void> {
	const Table = new Ascii('Modal Submit Handler');

	// eslint-disable-next-line n/no-path-concat
	const modalSubmitFiles: string[] = await PG(`${__dirname}/../Interactions/ModalSubmits/**/*.{ts,js}`);
	if (!modalSubmitFiles.length) return;

	let count = 0;
	for (const file of modalSubmitFiles) {
		const modalSubmit: IModalSubmitCommand = await importFile(file);
		if (!modalSubmit.id) {
			await Table.addRow(
				`${file.split('/').at(-1)?.slice(0, -3)}`,
				`⛔ Modal Submit ID is missing: ${file.split('/').at(-2)}/${file.split('/').at(-1)}`,
			);
			continue;
		}

		client.modalSubmits.set(modalSubmit.id, modalSubmit);
		Table.addRow(modalSubmit.id, '🔷 LOADED');
		count++;
	}

	if (client.showTable === true) {
		Table.sortColumn(1);
		console.log(Table.toString());
	} else if (client.showTable === 'both') {
		Table.sortColumn(1);
		console.log(Table.toString());
		console.log(`[INFO] Loaded ${count}/${modalSubmitFiles.length} Modal Submit Interactions.`);
	} else {
		console.log(`[INFO] Loaded ${count}/${modalSubmitFiles.length} Modal Submit Interactions.`);
	}
}
