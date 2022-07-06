import { ClientEvents } from 'discord.js';

export class Event<Key extends keyof ClientEvents> {
	public constructor(
		public name: Key,
		public execute: (...args: ClientEvents[Key]) => Promise<void>,
		public once?: boolean,
		public alias?: string,
	) {}
}
