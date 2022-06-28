import {
	ButtonInteraction,
	ChatInputApplicationCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
	ContextMenuInteraction,
	GuildMember,
	Interaction,
	PermissionResolvable,
	SelectMenuInteraction,
	Snowflake,
	UserApplicationCommandData,
} from 'discord.js';

interface ExecuteOptions<T> {
	interaction: T;
	args?: CommandInteractionOptionResolver;
}

type ExecuteFunction<T> = (options: ExecuteOptions<T>) => unknown;

export interface ExtendedSelectMenuInteraction extends SelectMenuInteraction {
	member: GuildMember;
}

export interface ExtendedButtonInteraction extends ButtonInteraction {
	member: GuildMember;
}

export interface ExtendedContextMenuInteraction extends ContextMenuInteraction {
	member: GuildMember;
}

export interface ExtendedCommandInteraction extends CommandInteraction {
	member: GuildMember;
}

export interface ICommand extends ChatInputApplicationCommandData {
	ownerOnly?: boolean;
	context?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	permissions?: PermissionResolvable[];
	cooldown?: number;
	execute: ExecuteFunction<ExtendedCommandInteraction>;
}

export interface IContextCommand extends UserApplicationCommandData {
	ownerOnly?: boolean;
	context?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	permissions?: PermissionResolvable[];
	cooldown?: number;
	execute: ExecuteFunction<ExtendedContextMenuInteraction>;
}

export interface IButtonCommand {
	id: string;
	ownerOnly?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	permissions?: PermissionResolvable[];
	cooldown?: number;
	execute: ExecuteFunction<ExtendedButtonInteraction>;
}

export interface ISelectMenuCommand {
	id: string;
	ownerOnly?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	permissions?: PermissionResolvable[];
	cooldown?: number;
	execute: ExecuteFunction<ExtendedSelectMenuInteraction>;
}
