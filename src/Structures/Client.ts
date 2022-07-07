import process from 'node:process';
import { promisify } from 'util';
import { Client as DiscordClient, Collection } from 'discord.js';
import glob from 'glob';
import Handlers from '../Handlers';
import {
	DriveFile,
	ExtendedApplicationCommandDataResolvable,
	IButtonCommand,
	ICommand,
	IContextCommand,
	ISelectMenuCommand,
	ItestGuild,
} from '../Typings';
import { testGuilds } from '../config';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { AsciiTable3 } = require('ascii-table3');

const PG = promisify(glob);

export class Client extends DiscordClient {
	public commands: Collection<string, ICommand> = new Collection();
	public contextMenuCommands: Collection<string, IContextCommand> = new Collection();
	public buttons: Collection<string, IButtonCommand> = new Collection();
	public buttonsCooldown: Collection<string, Collection<string, string[]>> = new Collection();
	public selectMenu: Collection<string, ISelectMenuCommand> = new Collection();
	public testGuilds: ItestGuild[] = testGuilds;
	public commandsDataArray: ExtendedApplicationCommandDataResolvable[] = [];
	public showTable: boolean | 'both' = false;
	public gdFolderStack: Collection<string, DriveFile[]> = new Collection();

	public constructor() {
		super({
			intents: 32767,
		});
	}

	public async start() {
		await this.registerModules();
		await this.login(process.env.TOKEN);
	}

	public async registerModules() {
		for (const [, handler] of Object.entries(Handlers)) {
			await handler(this, PG, AsciiTable3);
		}

		/* Register Commands to specific guilds */
		this.once('ready', async () => {
			for (const { id: guildId } of this.testGuilds) {
				const guild = this.guilds.cache.get(guildId);
				if (!guild) continue;
				const guildCommands = this.commandsDataArray.filter((command) => {
					if (!command.privateGuilds) return true;
					return command.guilds?.includes(guild.id);
				});
				await guild.commands.set(guildCommands);

				// Register Permission ( Deprecated )
				// const command = await guild.commands.set(guildCommands);
				// const Roles = (commandName: string) => {
				// 	const cmdPerms = this.commandsDataArray.find((c) => c.name === commandName)?.permissions;
				// 	if (!cmdPerms) return null;
				// 	return guild.roles.cache.filter((r) => cmdPerms.some((perm) => r.permissions.has(perm)));
				// };
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
