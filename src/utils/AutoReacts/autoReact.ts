import { DiscordAPIError, Message, MessageType } from 'discord.js';
import autoReactChannels from '../../Models/autoReactChannels';
import { logsEmbed } from '../Logger';
import { shuffle } from '../choice';

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
		reactionArray.map((emoji) =>
			message.react(emoji).catch((e) => {
				if (e instanceof DiscordAPIError) emojisToRemove.push(emoji);
				else throw e;
			}),
		),
	);

	// Remove bad emojis
	emojisToRemove.map((badEmoji) => {
		const index = reactionData.reactions.indexOf(badEmoji);
		if (index === -1) {
			return;
		}
		reactionData.reactions.splice(index, 1);
	});
	if (emojisToRemove.length !== 0) {
		if (!reactionData.random) reactionData.numberOfReactions -= emojisToRemove.length;
		await reactionData.save();
		await logsEmbed(`Removed bad emojis ${JSON.stringify(emojisToRemove)}`, message.guild, 'error');
	}
}
