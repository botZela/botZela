import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import rrModel, { RolesType } from '../../../Models/reactionRoles';
import { ICommand } from '../../../Typings';

export default {
	name: 'panel',
	description: 'Reaction Role Panel',
	permissions: ['ADMINISTRATOR'],

	execute: async ({ interaction }) => {
		const { guild } = interaction;

		if (!guild || !guild.me) {
			return interaction.reply({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const guildData = await rrModel.findOne({ guildId: guild.id });

		if (!guildData || guildData.roles.length === 0) {
			return interaction.reply({ content: 'There is no roles inside of this server.', ephemeral: true });
		}

		const options = guildData.roles
			.map((x) => {
				const y = x as RolesType;
				const role = guild.roles.cache.get(y.roleId);
				if (!role) return undefined;
				return {
					label: role.name,
					value: role.id,
					description: y.roleDescription ?? 'No Description',
					emoji: y.roleEmoji,
				} as MessageSelectOptionData;
			})
			.filter((x): x is MessageSelectOptionData => x !== undefined);

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

		await interaction.reply({ embeds: [panelEmbed], components, ephemeral: false });
	},
} as ICommand;
