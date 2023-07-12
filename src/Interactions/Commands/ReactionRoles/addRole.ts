import { ApplicationCommandOptionType } from 'discord.js';
import type { RolesType } from '../../../Models/reactionRoles';
import rrModel from '../../../Models/reactionRoles.js';
import type { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'add-role',
	description: 'Add a custom reaction role',
	defaultMemberPermissions: ['Administrator'],
	options: [
		{
			name: 'role',
			description: 'role to be assigned',
			type: ApplicationCommandOptionType.Role,
			required: true,
		},
		{
			name: 'description',
			description: 'description of this role',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: 'emoji',
			description: 'emoji for the role',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	execute: async ({ interaction }) => {
		const { options, guild } = interaction;
		if (!guild?.members.me) {
			return interaction.reply({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const role = options.getRole('role');
		if (!role) {
			return interaction.reply({ content: "Couldn't find the role.", ephemeral: true });
		}

		const roleDescription = options.getString('description') ?? undefined;
		const roleEmoji = options.getString('emoji') ?? undefined;

		if (role.position >= guild.members.me.roles.highest.position) {
			return interaction.reply({ content: "I can't assign a role that is higher or equal than me.", ephemeral: true });
		}

		const guildData = await rrModel.findOne({ guildId: guild.id });

		const newRole = {
			roleId: role.id,
			roleDescription,
			roleEmoji,
		};

		if (guildData) {
			let roleData = guildData.roles.find((x) => (x as RolesType).roleId === role.id) as RolesType | null;

			if (roleData) {
				roleData = newRole;
			} else {
				guildData.roles.push(newRole);
			}

			await guildData.save();
		} else {
			await rrModel.create({
				guildId: interaction.guildId,
				roles: newRole,
			});
		}

		await interaction.reply({ content: `Created a new Role : ${role.name}`, ephemeral: true });
	},
};

export default defaultExport;
