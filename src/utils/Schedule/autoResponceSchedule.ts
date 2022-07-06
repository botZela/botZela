import { Message } from 'discord.js';
import { flGrp } from './flGrp';
import { sendSchedule } from './sendSchedule';
import { logsMessage } from '../logsMessage';

export async function messageSchedule(message: Message) {
	const { member, channel } = message;
	if (!member || !message.guild) {
		console.error('[ERROR] Member or Guild is not defined');
		return;
	}

	setTimeout(() => {
		message.delete().catch(console.error);
	}, 1000);
	if (!member.roles.cache.map((r) => r.name).includes('1A')) {
		const response = await channel.send(`We are sorry, this feature is only available for 1A students.`);
		return setTimeout(() => {
			response.delete().catch(console.error);
		}, 10 * 1000);
	}
	const { filiere: fl, groupe: grp } = flGrp(member);
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!fl || !grp) {
		const response = await message.reply(
			'You are not elegible to get your schedule, you are missing the "groupe" or "filiere", try contacting server admins.',
		);
		return setTimeout(() => {
			response.delete().catch(console.error);
		}, 10 * 1000);
	}
	await sendSchedule(member, fl, grp);
	const response = await channel.send(
		`<@${member.id}> Your Schedule for branch ${fl} and groupe ${grp} is sent to your DMs.`,
	);
	setTimeout(() => {
		response.delete().catch(console.error);
	}, 10 * 1000);
	const logs = `[INFO] .${member.nickname ?? member.user.tag} got the schedule for branch .${fl} and groupe .${grp}`;
	await logsMessage(logs, message.guild);
}
