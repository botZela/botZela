import { ClientEvents } from 'discord.js';

export interface IEvent<Key extends keyof ClientEvents> {
	name: Key;
	alias?: string;
	once?: boolean;
	execute: (...args: ClientEvents[Key]) => Promise<void>;
}
