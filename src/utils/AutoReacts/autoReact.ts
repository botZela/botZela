import type { Message } from 'discord.js';
import { DiscordAPIError, MessageType } from 'discord.js';
import autoReactChannels from '../../Models/autoReactChannels.js';
import { logsEmbed } from '../Logger/index.js';
import { shuffle } from '../choice.js';

export async function autoReact(message: Message) {
	if (!message.inGuild() || (message.type !== MessageType.Default && message.type !== MessageType.Reply)) return;

	const reactionData = await autoReactChannels.findOne({ channelId: message.channel.id });
	if (!reactionData) return;

	let reactionArray: string[];
	if (reactionData.random) reactionArray = shuffle(reactionData.reactions, reactionData.numberOfReactions) as string[];
	else reactionArray = reactionData.reactions as string[];
	const emojisToRemove: string[] = [];

	// React with the emojis inside of reactionArray
	await Promise.all(
		reactionArray.map(async (emoji) =>
			message.react(emoji).catch((error) => {
				if (error instanceof DiscordAPIError) emojisToRemove.push(emoji);
				else throw error;
			}),
		),
	);

	// Remove bad emojis
	for (const badEmoji of emojisToRemove) {
		const index = reactionData.reactions.indexOf(badEmoji);
		if (index === -1) {
			continue;
		}

		reactionData.reactions.splice(index, 1);
	}

	if (emojisToRemove.length !== 0) {
		if (!reactionData.random) reactionData.numberOfReactions -= emojisToRemove.length;
		await reactionData.save();
		await logsEmbed(`Removed bad emojis ${JSON.stringify(emojisToRemove)}`, message.guild, 'error');
	}
}
