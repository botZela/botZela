import { ICommand, IContextCommand } from '../Typings/Command';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Command {
	public constructor(commandOptions: ICommand | IContextCommand) {
		Object.assign(this, commandOptions);
	}
}
