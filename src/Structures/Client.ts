import process from 'node:process';
import { promisify } from 'util';
import { Client as DiscordClient, Collection, Partials } from 'discord.js';
import glob from 'glob';
import Handlers from '../Handlers';
import {
	DriveFile,
	ExtendedApplicationCommandDataResolvable,
	IButtonCommand,
	ICommand,
	IContextCommand,
	IModalSubmitCommand,
	ISelectMenuCommand,
	ItestGuild,
} from '../Typings';
import { testGuilds } from '../config';
import { errors } from '../utils/Error';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { AsciiTable3 } = require('ascii-table3');

const PG = promisify(glob);

export class Client extends DiscordClient {
	public commands: Collection<string, ICommand> = new Collection();
	public contextMenuCommands: Collection<string, IContextCommand> = new Collection();
	public buttons: Collection<string, IButtonCommand> = new Collection();
	public buttonsCooldown: Collection<string, Collection<string, string[]>> = new Collection();
	public selectMenus: Collection<string, ISelectMenuCommand> = new Collection();
	public modalSubmits: Collection<string, IModalSubmitCommand> = new Collection();
	public testGuilds: ItestGuild[] = testGuilds;
	public commandsDataArray: ExtendedApplicationCommandDataResolvable[] = [];
	public showTable: boolean | 'both' = false;
	public gdFolderStack: Collection<string, DriveFile[]> = new Collection();

	public constructor() {
		super({
			intents: 3276799,
			partials: [Partials.Message],
		});
	}

	public async start() {
		await this.registerModules();
		await this.login(process.env.TOKEN);
		errors(); // Handle the uncaught Errors
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
			}
		});
	}
}
