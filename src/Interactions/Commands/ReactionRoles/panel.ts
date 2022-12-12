import {
	SelectMenuComponentOptionData,
	EmbedBuilder,
	ActionRowBuilder,
	MessageActionRowComponentBuilder,
	StringSelectMenuBuilder,
} from 'discord.js';
import rrModel, { RolesType } from '../../../Models/reactionRoles';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'panel',
	description: 'Reaction Role Panel',
	defaultMemberPermissions: ['Administrator'],

	execute: async ({ interaction }) => {
		const { guild } = interaction;

		if (!guild?.members.me) {
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
				const output: SelectMenuComponentOptionData = {
					label: role.name,
					value: role.id,
					description: y.roleDescription ?? 'No Description',
					emoji: y.roleEmoji,
				};
				return output;
			})
			.filter((x): x is SelectMenuComponentOptionData => x !== undefined);

		const panelEmbed = new EmbedBuilder().setTitle('Please Select a role below: ').setColor('Aqua');

		const components = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('reaction-roles')
					.setMinValues(0)
					.setMaxValues(options.length)
					.setPlaceholder('Choose your roles: ')
					.addOptions(options),
			),
		];

		await interaction.reply({ embeds: [panelEmbed], components, ephemeral: false });
	},
};

export default defaultExport;
