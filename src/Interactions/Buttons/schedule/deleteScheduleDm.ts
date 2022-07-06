import { Message } from 'discord.js';
import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';

export default {
	// Id: "DeleteMsgSchedule",
	// cooldown: 15 * 60 * 1000,
	// permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		const dm = await interaction.user.createDM();
		const toDel = await dm.send('You deleted the schedule from your dm.');
		const msgsToDel = (await dm.messages.fetch({ limit: 10, before: toDel.id })).filter(
			(m) => m.author.id === client.user?.id,
		);
		const Parray: (Promise<Message> | undefined)[] = [];

		for (let i = 0; i < 2; i++) {
			Parray.push(msgsToDel.at(i)?.delete());
		}
		await Promise.all(Parray);
		setTimeout(() => {
			toDel.delete().catch(console.error);
		}, 1000);
	},
} as IButtonCommand;
