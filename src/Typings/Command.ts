import {
	ButtonInteraction,
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	CommandInteraction,
	CommandInteractionOptionResolver,
	ContextMenuCommandInteraction,
	GuildMember,
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

export interface ExtendedInteraction extends CommandInteraction {
	member: GuildMember;
}

export interface ExtendedSelectMenuInteraction extends SelectMenuInteraction {
	member: GuildMember;
}

export interface ExtendedButtonInteraction extends ButtonInteraction {
	member: GuildMember;
}

export interface ExtendedContextMenuInteraction extends ContextMenuCommandInteraction {
	member: GuildMember;
}

export interface ExtendedCommandInteraction extends ChatInputCommandInteraction {
	member: GuildMember;
}

export interface ExtendedModalSubmitInteraction extends ModalSubmitInteraction {
	member: GuildMember;
}

interface BaseCommand {
	ownerOnly?: boolean;
	guilds?: Snowflake[];
	privateGuilds?: boolean;
	cooldown?: number;
	defaultMemberPermissions?: PermissionResolvable | null;
}

export interface ICommand extends ChatInputApplicationCommandData, BaseCommand {
	context?: boolean;
	execute: ExecuteFunction<ExtendedCommandInteraction>;
}

export interface IContextCommand extends UserApplicationCommandData, BaseCommand {
	context?: boolean;
	execute: ExecuteFunction<ExtendedContextMenuInteraction>;
}

export interface IButtonCommand extends BaseCommand {
	id: string;
	execute: ExecuteFunction<ExtendedButtonInteraction>;
}

export interface ISelectMenuCommand extends BaseCommand {
	id: string;
	execute: ExecuteFunction<ExtendedSelectMenuInteraction>;
}

export interface IModalSubmitCommand extends BaseCommand {
	id: string;
	execute: ExecuteFunction<ExtendedModalSubmitInteraction>;
}
