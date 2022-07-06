import rrModel, { RolesType } from '../../../Models/reactionRoles';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'remove-role',
	description: 'remove a custom Reaction role',
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'role',
			description: 'role to be Removed',
			type: 'ROLE',
			required: true,
		},
	],
	execute: async ({ interaction }) => {
		const { options, guild } = interaction;

		if (!guild || !guild.me) {
			return interaction.reply({ content: 'This command is used inside a server ...', ephemeral: true });
		}
		const role = options.getRole('role');

		const guildData = await rrModel.findOne({ guildId: guild.id });

		if (!guildData) {
			return interaction.reply({ content: 'There is no roles inside of this server.', ephemeral: true });
		}

		const guildRoles = guildData.roles as RolesType[];

		const findRole = guildRoles.find((x) => x.roleId === role?.id);

		if (!findRole) {
			return interaction.reply({ content: 'That role is not added to the reaction roles list.', ephemeral: true });
		}

		const filteredRoles = guildRoles.filter((x) => x.roleId !== role?.id);
		guildData.roles = filteredRoles;

		await guildData.save();

		await interaction.reply({ content: `Removed : ${role?.name ?? 'removed'}`, ephemeral: true });
	},
};

export default defaultExport;
