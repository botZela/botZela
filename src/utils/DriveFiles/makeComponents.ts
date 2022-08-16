import {
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	SelectMenuComponentOptionData,
	ButtonStyle,
	MessageActionRowComponentBuilder,
} from 'discord.js';

export function makeComponents(
	options: SelectMenuComponentOptionData[],
	link: string,
	page = 1,
): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
	const totalPages = Math.ceil(options.length / 25);
	return [
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new SelectMenuBuilder()
				.setCustomId('drivefiles-menu')
				.setPlaceholder('Select a folder: ')
				.addOptions(options.slice(25 * (page - 1), 25 * page)),
		),
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder({
				customId: 'button-drivefiles-prev',
				label: '◀ PREVIOUS',
				style: page === 1 ? ButtonStyle.Secondary : ButtonStyle.Success,
				emoji: '',
				disabled: page === 1,
			}),
			new ButtonBuilder({
				customId: `${page}`,
				label: `${page}/${totalPages}`,
				style: ButtonStyle.Secondary,
				disabled: true,
			}),
			new ButtonBuilder({
				customId: 'button-drivefiles-next',
				label: 'NEXT ▶',
				style: page === totalPages ? ButtonStyle.Secondary : ButtonStyle.Success,
				emoji: '',
				disabled: page === totalPages,
			}),
		),
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder({
				customId: 'button-drivefiles-back',
				label: 'Back',
				style: ButtonStyle.Secondary,
				emoji: '⬅',
			}),
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: link,
				label: 'View Folder',
				emoji: '📁',
			}),
		),
	];
}
