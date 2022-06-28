import { MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js';
import rrModel from '../../../Models/reactionRoles';
import { ICommand } from '../../../Typings';

export default {
	name: 'panel',
	description: 'Reaction Role Panel',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		const guildData = await rrModel.findOne({ guildId: interaction.guildId });

		if (!guildData || guildData.roles.length === 0) {
			return interaction.reply({ content: 'There is no roles inside of this server.', ephemeral: true });
		}

		const options = guildData.roles.map((x) => {
			const role = interaction.guild.roles.cache.get(x.roleId);

			return {
				label: role.name,
				value: role.id,
				description: x.roleDescription || 'No Description',
				emoji: x.roleEmoji,
			};
		});

		const panelEmbed = new MessageEmbed().setTitle('Please Select a role below: ').setColor('AQUA');

		const components = [
			new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('reaction-roles')
					.setMinValues(0)
					.setMaxValues(options.length)
					.setPlaceholder('Choose your roles: ')
					.addOptions(options),
			),
		];

		interaction.reply({ embeds: [panelEmbed], components, ephemeral: false });
	},
} as ICommand;
