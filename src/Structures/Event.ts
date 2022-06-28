import { ClientEvents } from 'discord.js';
import { IEvent } from '../Typings';

export class Event<Key extends keyof ClientEvents> {
	constructor(
		public name: Key,
		public execute: (...args: ClientEvents[Key]) => Promise<void>,
		public once?: boolean,
		public alias?: string,
	) {}
}
