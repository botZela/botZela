import type {
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
	args?: CommandInteractionOptionResolver;
	interaction: T;
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
	cooldown?: number;
	defaultMemberPermissions?: PermissionResolvable | null;
	guilds?: Snowflake[];
	ownerOnly?: boolean;
	privateGuilds?: boolean;
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
	execute: ExecuteFunction<ExtendedButtonInteraction>;
	id: string;
}

export interface ISelectMenuCommand extends BaseCommand {
	execute: ExecuteFunction<ExtendedSelectMenuInteraction>;
	id: string;
}

export interface IModalSubmitCommand extends BaseCommand {
	execute: ExecuteFunction<ExtendedModalSubmitInteraction>;
	id: string;
}
