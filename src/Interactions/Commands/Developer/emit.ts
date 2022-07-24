import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { client } from '../../..';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'emit',
	description: 'Event Emitter',
	defaultMemberPermissions: ['Administrator'],
	options: [
		{
			name: 'event',
			description: 'Guild Member Events',
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: 'Member Joined',
					value: 'guildMemberAdd',
				},
				{
					name: 'Member Left',
					value: 'guildMemberRemove',
				},
				{
					name: 'Bot Joind The Server',
					value: 'guildCreate',
				},
				{
					name: 'Bot Left The Server',
					value: 'guildDelete',
				},
			],
		},
		{
			name: 'member',
			description: 'The Member to execute the event on.',
			type: ApplicationCommandOptionType.User,
			required: false,
		},
	],
	async execute({ interaction }): Promise<void> {
		const choices = interaction.options.getString('event');
		const member = (interaction.options.getMember('member') ?? interaction.member) as GuildMember;

		switch (choices) {
			case 'guildMemberAdd': {
				client.emit('guildMemberAdd', member);
				break;
			}
			case 'guildMemberRemove': {
				client.emit('guildMemberRemove', member);
				break;
			}
			case 'guildCreate': {
				if (interaction.guild) client.emit('guildCreate', interaction.guild);
				break;
			}
			case 'guildDelete': {
				if (interaction.guild) client.emit('guildDelete', interaction.guild);
				break;
			}
			default: {
				break;
			}
		}

		await interaction.reply({ content: `Emitted The event ${choices ?? 'No Event'}`, ephemeral: true });
	},
};

export default defaultExport;
