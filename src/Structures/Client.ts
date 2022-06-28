const { AsciiTable3 } = require('ascii-table3');
import { ApplicationCommandDataResolvable, Client as DiscordClient, Collection } from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import {
	ItestGuild,
	ICommand,
	IButtonCommand,
	IContextCommand,
	ExtendedApplicationCommandDataResolvable,
	ISelectMenuCommand,
} from '../Typings';

import { testGuilds } from '../config';

import Handlers from '../Handlers';

const PG = promisify(glob);

export class Client extends DiscordClient {
	commands: Collection<string, ICommand> = new Collection();
	contextMenuCommands: Collection<string, IContextCommand> = new Collection();
	buttons: Collection<string, IButtonCommand> = new Collection();
	buttonsCooldown: Collection<string, Collection<string, string[]>> = new Collection();
	selectMenu: Collection<string, ISelectMenuCommand> = new Collection();
	testGuilds: ItestGuild[] = testGuilds;
	commandsDataArray: ExtendedApplicationCommandDataResolvable[] = [];

	showTable: boolean | 'both' = false;

	constructor() {
		super({
			intents: 32767,
		});
	}

	start() {
		this.registerModules();
		this.login(process.env.TOKEN);
	}

	async registerModules() {
		for (const [_, handler] of Object.entries(Handlers)) {
			handler(this, PG, AsciiTable3);
		}

		/* Register Commands to specific guilds */
		this.once('ready', async () => {
			for (let { id: guildId } of this.testGuilds) {
				const guild = this.guilds.cache.get(guildId);
				if (!guild) continue;
				const Roles = (commandName: string) => {
					const cmdPerms = this.commandsDataArray.find((c) => c.name === commandName)?.permissions;
					if (!cmdPerms) return null;
					return guild.roles.cache.filter((r) => cmdPerms.some((perm) => r.permissions.has(perm)));
				};
				let guildCommands = this.commandsDataArray.filter((command) => {
					if (!command.privateGuilds) return true;
					return command.guilds?.includes(guild.id);
				});
				const command = await guild.commands.set(guildCommands);

				// Register Permission ( Deprecated )
				// const fullPermissions: ApplicationCommand[] = command.reduce((acc, r) => {
				// 	const roles = Roles(r.name);
				// 	if (!roles) return acc;

				// 	const permissions = roles.reduce((a: , r) => {
				// 		return [...a, { id: r.id, type: 'ROLE', permission: true }];
				// 	}, []);

				// 	return [...acc, { id: r.id, permissions }];
				// }, []);
				// fullPermissions.map((com) => {
				// 	com.permissions?.push({ id: guild.ownerId, type: 'USER', permission: true });
				// });
				// await guild.commands.permissions.set({ fullPermissions });
			}
		});
	}
}
