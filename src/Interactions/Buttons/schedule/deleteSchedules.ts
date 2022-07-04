import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { logsMessage } from '../../../utils/logsMessage';

export default {
	id: 'schedule_delete_old',
	cooldown: 30 * 60 * 1000,
	// permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		const { member, guild } = interaction;
		if (!guild) {
			return await interaction.reply({
				content: `I dont know how you got this button ...`,
				ephemeral: true,
			});
		}

		await interaction.reply({
			content: `Removing Old Schedules ... Please wait.`,
			ephemeral: true,
		});

		const dmChannel = await client.users.createDM(member.id);

		const firstMsgs = (await dmChannel.messages.fetch({ limit: 30 }))
			.filter((m) => m.author.id === client.user?.id)
			.map((m) => m.id);

		let lastMsgId = firstMsgs.at(1) || firstMsgs.at(0);
		if (!lastMsgId) return;
		let botsMsgs;
		let msgDeleted = 0;
		do {
			botsMsgs = (await dmChannel.messages.fetch({ limit: 100, before: lastMsgId })).filter(
				(m) => m.author.id === client.user?.id,
			);
			lastMsgId = botsMsgs.at(-1)?.id;
			msgDeleted += botsMsgs.size;
			for (let [_, m] of botsMsgs) {
				if (m.deletable) {
					try {
						await m.delete();
					} catch (e) {
						return console.error(e);
					}
				}
			}
		} while (botsMsgs.size >= 100);

		interaction.editReply({
			content: `Deleted ${msgDeleted} messages from your DMs.`,
		});
		let toLog = `[INFO] .${member.nickname || member.user.tag} Deleted ${msgDeleted} messages from their DMs.`;
		logsMessage(toLog, guild);
	},
} as IButtonCommand;
