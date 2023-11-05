import type { AnyThreadChannel, GuildTextBasedChannel, Message } from 'discord.js';

export async function fetchAllMessages(
	channel: AnyThreadChannel | GuildTextBasedChannel,
	order: boolean,
): Promise<Message<boolean>[]> {
	const messages = [];

	let lastMsgId: string | undefined;
	let botsMsgs;
	do {
		botsMsgs = await channel.messages.fetch({ limit: 100, before: lastMsgId });
		lastMsgId = botsMsgs.at(-1)?.id;
		for (const [, msg] of botsMsgs) {
			try {
				messages.push(msg);
			} catch (error) {
				console.error(error);
			}
		}
	} while (botsMsgs.size >= 100);

	if (order) messages.reverse();

	return messages;
}
