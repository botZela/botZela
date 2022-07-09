import { MessageActionRow, MessageSelectMenu, MessageButton, MessageSelectOptionData } from 'discord.js';

export function makeComponents(options: MessageSelectOptionData[], fileId: string, page = 1) {
	const totalPages = Math.ceil(options.length / 25);
	return [
		new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId('drivefiles-menu')
				.setPlaceholder('Select a folder: ')
				.addOptions(options.slice(25 * (page - 1), 25 * page)),
		),
		new MessageActionRow().addComponents(
			new MessageButton({
				customId: 'button-drivefiles-prev',
				label: '◀ PREVIOUS',
				style: page === 1 ? 'SECONDARY' : 'SUCCESS',
				emoji: '',
				disabled: page === 1,
			}),
			new MessageButton({ customId: `${page}`, label: `${page}/${totalPages}`, style: 'SECONDARY', disabled: true }),
			new MessageButton({
				customId: 'button-drivefiles-next',
				label: 'NEXT ▶',
				style: page === totalPages ? 'SECONDARY' : 'SUCCESS',
				emoji: '',
				disabled: page === totalPages,
			}),
		),
		new MessageActionRow().addComponents(
			new MessageButton({ customId: 'button-drivefiles-back', label: 'Back', style: 'SECONDARY', emoji: '⬅' }),
			new MessageButton({
				style: 'LINK',
				url: `https://drive.google.com/drive/folders/${fileId}`,
				label: 'View Folder',
				emoji: '📁',
			}),
		),
	];
}
