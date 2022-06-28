import { ApplicationCommand, Role } from 'discord.js';
import { client } from '..';
import { Client } from '../Structures';
import { ICommand, IContextCommand, RegisterCommandsOptions } from '../Typings';
import { importFile } from '../utils';
import { Perms } from '../Validation';

async function registerCommands({ commands, guildId }: RegisterCommandsOptions) {
	if (guildId) {
		client.guilds.cache.get(guildId)?.commands.set(commands);
		console.log(`Registering commands to ${client.guilds.cache.get(guildId)?.name}`);
	} else {
		client.application?.commands.set(commands);
		console.log('Registering global commands');
	}
}

export async function contextMenuHandler(client: Client, PG: any, Ascii: new (arg0: string) => any): Promise<void> {
	const Table = new Ascii('Context Menu Command Loaded');

	let commandsFiles: string[] = await PG(`${__dirname}/../Interactions/ContextMenu/**/*.{ts,js}`);
	if (!commandsFiles.length) return;

	let count = 0;
	for (let file of commandsFiles) {
		const command: IContextCommand = await importFile(file);
		if (!command.name) {
			Table.addRow(file.split('/').at(-1), '🟠 FAILED', 'Missing a name.');
			continue;
		}
		if (command.permissions) {
			if (command.permissions.every((perm) => Perms.includes(perm))) {
				command.defaultPermission = false;
			} else {
				Table.addRow(command.name, '🟠 FAILED', 'Permissions are invalid.');
				continue;
			}
		}

		if (command.guilds) {
			command.guilds = command.guilds.filter((guildId) => guildId != '');
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
