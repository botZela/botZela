import type { Snowflake } from 'discord.js';
import { choice } from '../choice';

export function greetings(memberId: Snowflake) {
	const emojis = [`:confetti_ball:`, `:tada:`, `:partying_face:`, `:innocent:`, `:sparkles:`];
	const emoji = choice(emojis);
	const welcomeMsgs = [
		`<@${memberId}> just joined the server ${emoji}- glhf!`,
		`<@${memberId}> just joined ${emoji}. Everyone, look busy!`,
		`<@${memberId}> just joined ${emoji}. Can I get a heal?`,
		`<@${memberId}> joined your party ${emoji}.`,
		`<@${memberId}> joined ${emoji}. You must construct additional pylons.`,
		`Ermagherd. <@${memberId}> is here ${emoji}.`,
		`Welcome, <@${memberId}> ${emoji}. Stay awhile and listen.`,
		`Welcome, <@${memberId}> ${emoji}. We were expecting you ( ͡° ͜ʖ ͡°)`,
		`Welcome, <@${memberId}> ${emoji}. We hope you brought pizza.`,
		`Welcome <@${memberId}> ${emoji}. Leave your weapons by the door.`,
		`A wild <@${memberId}> appeared ${emoji}.`,
		`Swoooosh. <@${memberId}> just landed ${emoji}.`,
		`Brace yourselves. <@${memberId}> just joined the server ${emoji}.`,
		`<@${memberId}> just joined ${emoji}. Hide your bananas.`,
		`<@${memberId}> just arrived ${emoji}. Seems OP - please nerf.`,
		`<@${memberId}> just slid into the server ${emoji}.`,
		`A <@${memberId}> has spawned in the server ${emoji}.`,
		`Big <@${memberId}> showed up ${emoji}!`,
		`<@${memberId}> just showed up ${emoji}. Hold my beer.`,
	];
	return choice(welcomeMsgs);
}
