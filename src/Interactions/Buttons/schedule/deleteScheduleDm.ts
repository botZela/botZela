import { setTimeout } from 'node:timers';
import type { Message } from 'discord.js';
import { client } from '../../..';
import type { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'DeleteMsgSchedule',
	// cooldown: 15 * 60 * 1000,
	// defaultMemberPermissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		const dm = await interaction.user.createDM();
		const toDel = await dm.send('You deleted the schedule from your dm.');
		const msgsToDel = (await dm.messages.fetch({ limit: 10, before: toDel.id })).filter(
			(msg) => msg.author.id === client.user?.id,
		);
		const Parray: (Promise<Message> | undefined)[] = [];

		for (let ii = 0; ii < 2; ii++) {
			Parray.push(msgsToDel.at(ii)?.delete());
		}

		await Promise.all(Parray);
		setTimeout(async () => {
			try {
				await toDel.delete();
			} catch (error) {
				console.error(error);
			}
		}, 1_000);
	},
};

export default defaultExport;
