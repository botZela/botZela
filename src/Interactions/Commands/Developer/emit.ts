import { GuildMember } from 'discord.js';
import { client } from '../../..';
import { ICommand } from '../../../Typings';

export default {
	name: 'emit',
	description: 'Event Emitter',
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'event',
			description: 'Guild Member Events',
			type: 'STRING',
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
			type: 'USER',
			required: false,
		},
	],
	async execute({ interaction }): Promise<void> {
		const choices = interaction.options.getString('event');
		const member = (interaction.options.getMember('member') as GuildMember) || interaction.member;

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
		}

		await interaction.reply({ content: `Emitted The event ${choices}`, ephemeral: true });
	},
} as ICommand;
