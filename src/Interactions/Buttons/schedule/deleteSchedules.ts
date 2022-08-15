import { client } from '../../..';
import { IButtonCommand } from '../../../Typings';
import { logsEmbed } from '../../../utils/Logger';

const defaultExport: IButtonCommand = {
	id: 'schedule_delete_old',
	cooldown: 30 * 60 * 1000,
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		const { member, guild } = interaction;
		if (!guild) {
			return interaction.reply({
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

		let lastMsgId = firstMsgs.at(1) ?? firstMsgs.at(0);
		if (!lastMsgId) return;
		let botsMsgs;
		let msgDeleted = 0;
		do {
			botsMsgs = (await dmChannel.messages.fetch({ limit: 100, before: lastMsgId })).filter(
				(m) => m.author.id === client.user?.id,
			);
			lastMsgId = botsMsgs.at(-1)?.id;
			msgDeleted += botsMsgs.size;
			for (const [, m] of botsMsgs) {
				if (m.deletable) {
					try {
						await m.delete();
					} catch (e) {
						return console.error(e);
					}
				}
			}
		} while (botsMsgs.size >= 100);

		await interaction.editReply({
			content: `Deleted ${msgDeleted} messages from your DMs.`,
		});
		const toLog = `%user% Deleted ${msgDeleted} messages from their DMs.`;
		await logsEmbed(toLog, guild, 'info', member);
	},
};

export default defaultExport;
