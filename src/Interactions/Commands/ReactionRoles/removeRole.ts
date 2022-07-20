import { ApplicationCommandOptionType } from 'discord.js';
import rrModel from '../../../Models/reactionRoles';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'remove-role',
	description: 'remove a custom Reaction role',
	permissions: ['Administrator'],
	options: [
		{
			name: 'role',
			description: 'role to be Removed',
			type: ApplicationCommandOptionType.Role,
			required: true,
		},
	],
	execute: async ({ interaction }) => {
		const { options, guild } = interaction;

		if (!guild || !guild.members.me) {
			return interaction.reply({ content: 'This command is used inside a server ...', ephemeral: true });
		}
		const role = options.getRole('role');

		const guildData = await rrModel.findOne({ guildId: guild.id });

		if (!guildData) {
			return interaction.reply({ content: 'There is no roles inside of this server.', ephemeral: true });
		}

		const reqRole = guildData.roles.find((x) => x.roleId === role?.id);

		if (!reqRole) {
			return interaction.reply({ content: 'That role is not added to the reaction roles list.', ephemeral: true });
		}

		const indexOfRole = guildData.roles.indexOf(reqRole);
		if (indexOfRole === -1) {
			return interaction.reply({ content: 'That role is not added to the reaction roles list.', ephemeral: true });
		}

		guildData.roles.splice(indexOfRole, 1);
		await guildData.save();
		await interaction.reply({ content: `Removed : ${role?.name ?? 'removed'}`, ephemeral: true });
	},
};

export default defaultExport;
