/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client } from '../Structures';
import { IContextCommand } from '../Typings';
import { importFile } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function contextMenuHandler(client: Client, PG: any, Ascii: any): Promise<void> {
	const Table = new Ascii('Context Menu Command Loaded');

	const commandsFiles: string[] = await PG(`${__dirname}/../Interactions/ContextMenu/**/*.{ts,js}`);
	if (!commandsFiles.length) return;

	let count = 0;
	for (const file of commandsFiles) {
		const command: IContextCommand = await importFile(file);
		if (!command.name) {
			Table.addRow(file.split('/').at(-1), '🟠 FAILED', 'Missing a name.');
			continue;
		}

		if (command.guilds) {
			command.guilds = command.guilds.filter((guildId) => guildId !== '');
			if (command.guilds.some((guildId) => client.testGuilds.map((guild) => guild.id).includes(guildId))) {
				command.privateGuilds = true;
			} else if (command.guilds.length !== 0) {
				Table.addRow(command.name, '🟠 FAILED', 'Cant find the guilds');
				continue;
			}
		}

		client.contextMenuCommands.set(command.name, command);
		client.commandsDataArray.push(command);
		await Table.addRow(command.name, '🔵 SUCCESSFUL', '');
		count++;
	}

	if (client.showTable === true) {
		Table.sortColumn(1);
		console.log(Table.toString());
	} else if (client.showTable === 'both') {
		Table.sortColumn(1);
		console.log(Table.toString());
		console.log(`[INFO] Loaded ${count}/${commandsFiles.length} Context Menu Commands.`);
	} else {
		console.log(`[INFO] Loaded ${count}/${commandsFiles.length} Context Menu Commands.`);
	}
}
