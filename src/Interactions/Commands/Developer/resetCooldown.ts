import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { client } from '../../..';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'resetcooldown',
	description: 'Reset the cooldown for all users or just a member.',
	defaultMemberPermissions: ['Administrator'],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'member',
			description: 'The member that you want to reset the cooldown.',
			type: ApplicationCommandOptionType.User,
			required: false,
		},
	],

	async execute({ interaction }): Promise<void> {
		const member = interaction.options.getMember('member') as GuildMember | null;

		if (member) {
			client.buttonsCooldown.forEach((guilds) => {
				guilds.forEach((members) => {
					if (members.includes(member.id)) {
						const index = members.indexOf(member.id);
						if (index > -1) {
							members.splice(index, 1);
						}
					}
				});
			});
		} else {
			client.buttonsCooldown.forEach((guilds) => {
				guilds.forEach((members) => {
					members.splice(0, members.length);
				});
			});
		}
		await interaction.reply({
			content: `Reseted the cooldowns for ${member?.toString() ?? 'everyone'}`,
			ephemeral: true,
		});
	},
};

export default defaultExport;
