import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import type { IContextCommand } from '../../../Typings';

const defaultExport: IContextCommand = {
	name: 'User Info',
	type: ApplicationCommandType.User,
	context: true,
	// Permissions: ["ADMINISTRATOR"],
	async execute({ interaction }): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({ content: 'This command is used inside a server ...', ephemeral: true });
			return;
		}

		const target = await interaction.guild.members.fetch(interaction.targetId);

		const response = new EmbedBuilder()
			.setColor('Random')
			.setAuthor({
				name: target.user.tag,
				iconURL: target.user.displayAvatarURL({ size: 512 }),
			})
			.setThumbnail(target.user.displayAvatarURL({ size: 512 }))
			.addFields([
				{ name: 'ID', value: `${target.user.id}` },
				{
					name: 'Roles',
					value: `${
						target.roles.cache
							.map((role) => role)
							.join(' ')
							.replace('@everyone', '') || 'None'
					}`,
				},
				{ name: 'Member Since', value: `<t:${Math.floor((target.joinedTimestamp ?? 0) / 1_000)}:R>`, inline: true },
				{
					name: 'Discord User Since',
					value: `<t:${Math.floor(target.user.createdTimestamp / 1_000)}:R>`,
					inline: true,
				},
			]);

		await interaction.reply({ embeds: [response], ephemeral: true });
	},
};

export default defaultExport;
