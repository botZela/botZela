import type { ApplicationCommandDataResolvable, Snowflake } from 'discord.js';

export interface RegisterCommandsOptions {
	commands: ApplicationCommandDataResolvable[];
	guildId?: string;
}

export interface ItestGuild {
	id: string;
	name: string;
}

export type ExtendedApplicationCommandDataResolvable = ApplicationCommandDataResolvable & {
	context?: boolean;
	cooldown?: number;
	guilds?: Snowflake[];
	ownerOnly?: boolean;
	privateGuilds?: boolean;
};
