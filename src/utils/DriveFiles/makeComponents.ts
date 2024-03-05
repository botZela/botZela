import type { SelectMenuComponentOptionData, MessageActionRowComponentBuilder } from 'discord.js';
import { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import type { IPath } from '../../Typings';

export function makeComponents(
	options: SelectMenuComponentOptionData[],
	path: IPath,
	stackSize: number,
	page = 1,
): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
	const totalPages = Math.ceil(options.length / 25);
	return [
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('drivefiles-menu')
				.setPlaceholder('Select a folder: ')
				.addOptions(options.slice(25 * (page - 1), 25 * page)),
		),
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder({
				customId: 'button-drivefiles-prev',
				label: '◀ PREVIOUS',
				style: page === 1 ? ButtonStyle.Secondary : ButtonStyle.Success,
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
				disabled: page === totalPages,
			}),
		),
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder({
				customId: 'button-drivefiles-back',
				label: 'Back',
				style: ButtonStyle.Secondary,
				emoji: '⬅',
				disabled: stackSize === 1,
			}),
			new ButtonBuilder({
				style: ButtonStyle.Link,
				url: path.link,
				label: 'View Folder',
				emoji: '📁',
			}),
		),
	];
}
