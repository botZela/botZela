import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '../..';
import { Event } from '../../structures/Event';
import { ExtendedInteraction } from '../../typings';

export default new Event('interactionCreate', async (interaction) => {
	// Chat Input Commands
	if (interaction.isCommand()) {
		await interaction.deferReply();
		const command = client.commands.get(interaction.commandName);
		if (!command) return interaction.followUp('You have used a non existant command.');
		command.execute({
			args: interaction.options as CommandInteractionOptionResolver,
			client,
			interaction: interaction as ExtendedInteraction,
		});
	}
});
