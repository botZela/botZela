import { client } from '../../..';
import { ICommand } from '../../../Typings';

export default {
	name: 'ping',
	description: 'Sends Back PONG',
	permissions: ['ADMINISTRATOR'],
	async execute({ interaction }) {
		// Await interaction.reply({ content: `PONG after \`${client.ws.ping}ms\``, ephemeral: true });
		await interaction.reply({
			content: `🏓Latency is \`${Date.now() - interaction.createdTimestamp}ms\`. API Latency is \`${Math.round(
				client.ws.ping,
			)}ms\`.`,
			ephemeral: true,
		});
	},
} as ICommand;
