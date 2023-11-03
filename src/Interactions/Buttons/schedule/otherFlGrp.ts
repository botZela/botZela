import type { MessageActionRowComponentBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import type { IButtonCommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: IButtonCommand = {
	id: 'sendOtherFlGrp',
	// cooldown: 15 * 60 * 1000,
	// defaultMemberPermissions : ["ADMINISTRATOR"],
	async execute({ interaction }): Promise<void> {
		const row1 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		const embed = createEmbed(
			'Get the Schedule for any Branch or groupe you like.',
			'Choose below the branch and the filiere you want.',
		)
			.setColor('Red')
			.addFields([
				{ name: 'Any Suggestions', value: `Consider sending us your feedback in <#922875567357984768>, Thanks.` },
			]);

		const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
		const groupesArray = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];

		const filieres = filieresArray.map((x) => ({
			label: x,
			value: x,
			description: `Schedule for filiere \`${x}\``,
		}));
		const groupes = groupesArray.map((x) => ({
			label: x,
			value: x,
			description: `Schedule for groupe \`${x}\``,
		}));

		row1.addComponents(
			new StringSelectMenuBuilder().setCustomId('filiere').setMinValues(1).setMaxValues(1).addOptions(filieres),
		);

		row2.addComponents(
			new StringSelectMenuBuilder().setCustomId('groupe').setMinValues(1).setMaxValues(1).addOptions(groupes),
		);

		row3.addComponents(
			new ButtonBuilder()
				.setCustomId('confirmSchedule')
				.setLabel('Confirm')
				.setStyle(ButtonStyle.Success)
				.setEmoji('✅'),
		);

		row3.addComponents(
			new ButtonBuilder().setCustomId('abortSchedule').setLabel('Abort').setStyle(ButtonStyle.Danger).setEmoji('🛑'),
		);

		await interaction.reply({
			embeds: [embed],
			components: [row1, row2, row3],
			ephemeral: true,
		});
	},
};

export default defaultExport;
