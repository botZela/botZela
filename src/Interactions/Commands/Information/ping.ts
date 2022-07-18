import { client } from '../../..';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'ping',
	description: 'Sends Back PONG',
	permissions: ['Administrator'],
	async execute({ interaction }) {
		// Await interaction.reply({ content: `PONG after \`${client.ws.ping}ms\``, ephemeral: true });
		await interaction.reply({
			content: `🏓Latency is \`${Date.now() - interaction.createdTimestamp}ms\`. API Latency is \`${Math.round(
				client.ws.ping,
			)}ms\`.`,
			ephemeral: true,
		});
	},
};

export default defaultExport;
