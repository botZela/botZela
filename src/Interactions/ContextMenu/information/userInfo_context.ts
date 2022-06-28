import { MessageEmbed } from 'discord.js';
import { IContextCommand } from '../../../Typings';

export default {
	name: 'User Info',
	type: 'USER',
	context: true,
	// permissions: ["ADMINISTRATOR"],
	async execute({ interaction }): Promise<void> {
		const target = await interaction.guild.members.fetch(interaction.targetId);

		const response = new MessageEmbed()
			.setColor('AQUA')
			.setAuthor({
				name: target.user.tag,
				iconURL: target.user.avatarURL({ dynamic: true, size: 512 }),
			})
			.setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
			.addField('ID', `${target.user.id}`)
			.addField(
				'Roles',
				`${
					target.roles.cache
						.map((r) => r)
						.join(' ')
						.replace('@everyone', '') || 'None'
				}`,
			)
			.addField('Member Since', `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, true)
			.addField('Discord User Since', `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, true);

		interaction.reply({ embeds: [response], ephemeral: true });
	},
} as IContextCommand;
