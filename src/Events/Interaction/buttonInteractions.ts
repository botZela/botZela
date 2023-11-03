import { setTimeout } from 'node:timers';
import type { GuildMember, Interaction } from 'discord.js';
import { Collection } from 'discord.js';
import { client } from '../..';
import type { Event } from '../../Structures';
import type { ExtendedButtonInteraction } from '../../Typings';

const defaultExport: Event<'interactionCreate'> = {
	name: 'interactionCreate',
	alias: 'ButtonInteraction',
	async execute(interaction: Interaction) {
		if (!interaction.isButton() || !interaction.guild) return;
		const { customId, guild } = interaction;
		const member = interaction.member as GuildMember;

		const Button = client.buttons.get(customId);

		if (!Button) {
			await interaction.reply({ content: 'this Button is not handle for now.', ephemeral: true });
			return;
		}

		if (Button.cooldown && client.buttonsCooldown.get(customId)?.get(guild.id)?.includes(member.id)) {
			await interaction.reply({ content: 'You are on cooldown. Try again later.', ephemeral: true });
			return;
		}

		if (Button.defaultMemberPermissions && !member.permissions.any(Button.defaultMemberPermissions)) {
			await interaction.reply({ content: 'You are missing Permissions.', ephemeral: true });
			return;
		}

		if (Button.ownerOnly && member.id !== guild.ownerId) {
			await interaction.reply({ content: 'You are not the owner.', ephemeral: true });
			return;
		}

		if (Button.cooldown) {
			if (!client.buttonsCooldown.get(customId)) {
				client.buttonsCooldown.set(customId, new Collection());
				client.buttonsCooldown.get(customId)?.set(guild.id, []);
			}

			if (!client.buttonsCooldown.get(customId)?.get(guild.id)) {
				client.buttonsCooldown.get(customId)?.set(guild.id, []);
			}

			client.buttonsCooldown.get(customId)?.get(guild.id)?.push(member.id);
			setTimeout(() => {
				const index = client.buttonsCooldown.get(customId)?.get(guild.id)?.indexOf(member.id) ?? -1;
				if (index > -1) {
					client.buttonsCooldown.get(customId)?.get(guild.id)?.splice(index, 1);
				}
			}, Button.cooldown);
		}

		await Button.execute({
			interaction: interaction as ExtendedButtonInteraction,
		});
	},
};

export default defaultExport;
