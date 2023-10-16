import type { ButtonComponent, MessageActionRowComponentBuilder } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import type { IButtonCommand } from '../../../Typings';

const defaultExport: IButtonCommand = {
	id: 'button-schedule-send',
	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const { embeds, components } = interaction.message;
		const component = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		const resComponents = components.at(0)?.components.filter((x) => x.customId !== 'button-schedule-send') ?? [];
		component.addComponents(resComponents.map((x) => new ButtonBuilder((x as ButtonComponent).data)));

		await interaction.member.send({
			components: [component],
			embeds,
		});
		await interaction.followUp({ content: 'Check your Direct Messages to Check your Schedule.' });
	},
};

export default defaultExport;
