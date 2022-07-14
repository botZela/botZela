import {
	ButtonInteraction,
	ChatInputApplicationCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
	ContextMenuInteraction,
	GuildMember,
	Interaction,
	ModalSubmitInteraction,
	PermissionResolvable,
	SelectMenuInteraction,
	Snowflake,
	UserApplicationCommandData,
} from 'discord.js';

interface ExecuteOptions<T> {
	interaction: T;
	args?: CommandInteractionOptionResolver;
}

type ExecuteFunction<T> = (options: ExecuteOptions<T>) => Promise<unknown>;

export interface ExtendedInteraction extends Interaction {
	member: GuildMember;
}

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

export interface ExtendedModalSubmitInteraction extends ModalSubmitInteraction {
	member: GuildMember;
}

interface BaseCommand {
	ownerOnly?: boolean;
	context?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	permissions?: PermissionResolvable[];
	cooldown?: number;
}

export interface ICommand extends ChatInputApplicationCommandData, BaseCommand {
	execute: ExecuteFunction<ExtendedCommandInteraction>;
}

export interface IContextCommand extends UserApplicationCommandData, BaseCommand {
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

export interface IModalSubmitCommand extends BaseCommand {
	id: string;
	ownerOnly?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	permissions?: PermissionResolvable[];

	execute: ExecuteFunction<ExtendedModalSubmitInteraction>;
}
