import type { ClientEvents } from 'discord.js';

export interface IEvent<Key extends keyof ClientEvents> {
	alias?: string;
	execute(...args: ClientEvents[Key]): Promise<void>;
	name: Key;
	once?: boolean;
}
