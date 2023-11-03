import type { EmbedField } from 'discord.js';
import autoReactChannels from '../../Models/autoReactChannels';
import gChannels from '../../Models/guildChannels';
import linksModel from '../../Models/guildLinks';
import gRoles from '../../Models/guildRoles';
import type { ExtendedCommandInteraction } from '../../Typings';
import { createInfoEmbed } from '../Embeds';

export async function checkStatus(interaction: ExtendedCommandInteraction) {
	const embed = createInfoEmbed('Checking Server');
	const embedFields: EmbedField[] = [];

	const linksData = await linksModel.findOne({ guildId: interaction.guild?.id });
	if (linksData) {
		const field: EmbedField = { name: 'Important links', value: '', inline: false };
		field.value += `__**Spread Sheet**__  : ${linksData.spreadsheet ? `✅ [link](${linksData.spreadsheet})` : '❌'}\n`;
		field.value += `__**Form**__          : ${linksData.form ? `✅ [link](${linksData.form})` : '❌'}\n`;
		embedFields.push(field);
	}

	const channelsData = (await gChannels.findOne({ guildId: interaction.guild?.id }))?.channels;
	if (channelsData) {
		const field: EmbedField = { name: 'Channels', value: '', inline: false };
		const channelsType = ['LOGS', 'COMMANDS', 'INTRODUCE'];
		for (const x of channelsType) {
			field.value += `__**${x} Channel**__  : ${channelsData.get(x) ? `<#${channelsData.get(x)!}>` : '❌'}\n`;
		}

		embedFields.push(field);
	}

	const rolesData = (await gRoles.findOne({ guildId: interaction.guild?.id }))?.roles;
	if (rolesData) {
		const rolesArray = [...rolesData.values()].map((x) => `<@&${x}> `);
		const total = rolesArray.reduce((acc, x) => acc + x.length, 0);
		const len = total % 1_024 === 0 && total > 0 ? Math.floor(total / 1_024) : Math.ceil(total / 1_024);
		const pageSize = Math.floor(rolesArray.length / len);
		for (let ii = 0; ii < len; ii++) {
			const field: EmbedField = { name: `Roles${len === 1 ? '' : ` ${ii + 1}`}`, value: '', inline: true };
			const data = rolesArray.slice(ii * pageSize, (ii + 1) * pageSize);

			for (const role of data) {
				field.value += `${role}`;
			}

			embedFields.push(field);
		}
	}

	const autoReactData = await autoReactChannels.find({ guildId: interaction.guild?.id });
	if (autoReactData.length !== 0) {
		const field: EmbedField = { name: 'Auto React Channels', value: '', inline: false };
		for (const channelData of autoReactData) {
			field.value += `<#${channelData.channelId}> :\n`;
			field.value += `__**Reactions**__ ${channelData.reactions.join(', ')}; `;
			field.value += `__**Random?**__ : ${channelData.random ? '✅' : '❌'}; `;
			field.value += `__**Number**__ : ${channelData.numberOfReactions}/${channelData.reactions.length}\n`;
		}

		embedFields.push(field);
	}

	embed.addFields(embedFields);
	return interaction.followUp({
		embeds: [embed],
		ephemeral: true,
	});
}
