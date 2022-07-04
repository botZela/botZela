import { Collection } from 'discord.js';
import { client } from '../..';
import { Event } from '../../Structures';
import { ExtendedButtonInteraction } from '../../Typings';

export default {
	name: 'interactionCreate',
	alias: 'ButtonInteraction',
	async execute(interaction: ExtendedButtonInteraction) {
		if (!interaction.isButton() || !interaction.guild) return;
		const { customId, guild, member } = interaction;
		const Button = client.buttons.get(customId);

		if (!Button) {
			return interaction.reply({ content: 'this Button is not handle for now.', ephemeral: true });
		}

		if (Button.cooldown && client.buttonsCooldown.get(customId)?.get(guild.id)?.includes(member.id)) {
			return interaction.reply({ content: 'You are on cooldown. Try again later.', ephemeral: true });
		}

		if (Button.permissions && !Button.permissions.some((perm) => member.permissions.has(perm))) {
			return interaction.reply({ content: 'You are missing permissions.', ephemeral: true });
		}

		if (Button.ownerOnly && member.id !== guild?.ownerId) {
			return interaction.reply({ content: 'You are not the owner.', ephemeral: true });
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

		Button.execute({
			interaction: interaction as ExtendedButtonInteraction,
		});
	},
} as Event<'interactionCreate'>;
