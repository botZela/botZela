import { ApplicationCommandDataResolvable, PermissionResolvable, Snowflake } from 'discord.js';

export interface RegisterCommandsOptions {
	guildId?: string;
	commands: ApplicationCommandDataResolvable[];
}

export interface ItestGuild {
	name: string;
	id: string;
}

export type ExtendedApplicationCommandDataResolvable = {
	ownerOnly?: boolean;
	context?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	cooldown?: number;
	permissions?: PermissionResolvable[];
} & ApplicationCommandDataResolvable;
