import { ICommand, IContextCommand } from '../Typings/Command';

export class Command {
	constructor(commandOptions: ICommand | IContextCommand) {
		Object.assign(this, commandOptions);
	}
}
