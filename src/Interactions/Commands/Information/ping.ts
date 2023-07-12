import type { ICommand } from '../../../Typings';
import { createInfoEmbed } from '../../../utils/index.js';

const defaultExport: ICommand = {
	name: 'ping',
	description: 'Sends Back PONG',
	defaultMemberPermissions: ['Administrator'],
	async execute({ interaction }) {
		// Await interaction.reply({ content: `PONG after \`${client.ws.ping}ms\``, ephemeral: true });
		const { client } = interaction;
		let totalSeconds = client.uptime / 1_000;
		const days = Math.floor(totalSeconds / 86_400);
		totalSeconds %= 86_400;
		const hours = Math.floor(totalSeconds / 3_600);
		totalSeconds %= 3_600;
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = Math.floor(totalSeconds % 60);
		const uptime = `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds`;

		const embed = createInfoEmbed('Ping Pong', 'Information about the Client.');
		embed.addFields([
			{
				name: '🏓 Latency 🏓',
				value: `Client Latency : \`${Date.now() - interaction.createdTimestamp}ms\`.\nAPI Latency : \`${Math.round(
					client.ws.ping,
				)}ms\`.`,
			},
			{
				name: '⌛ Uptime ⌛',
				value: `${uptime}`,
			},
		]);
		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};

export default defaultExport;
