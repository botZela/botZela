import type { ICommand, IContextCommand } from '../Typings/Command';

export class Command {
	public constructor(commandOptions: ICommand | IContextCommand) {
		Object.assign(this, commandOptions);
	}
}
