import { flGrp } from './flGrp';
import { logsMessage } from '../logsMessage';
import { sendSchedule } from './sendSchedule';
import { Message } from 'discord.js';

export async function messageSchedule(message: Message) {
	const { member, channel } = message;
	if (!member || !message.guild) {
		console.error('[ERROR] Member or Guild is not defined');
		return;
	}

	setTimeout(() => message.delete(), 1000);
	if (!member.roles.cache.map((r) => r.name).includes('1A')) {
		let response = await channel.send(`We are sorry, this feature is only available for 1A students.`);
		return setTimeout(() => response.delete(), 10 * 1000);
	}
	const { filiere: fl, groupe: grp } = flGrp(member);
	if (!fl || !grp) {
		let response = await message.reply(
			'You are not elegible to get your schedule, you are missing the "groupe" or "filiere", try contacting server admins.',
		);
		return setTimeout(() => response.delete(), 10 * 1000);
	}
	await sendSchedule(member, fl, grp);
	let response = await channel.send(
		`<@${member.id}> Your Schedule for branch ${fl} and groupe ${grp} is sent to your DMs.`,
	);
	setTimeout(() => response.delete(), 10 * 1000);
	let logs = `[INFO] .${member.nickname} got the schedule for branch .${fl} and groupe .${grp}`;
	logsMessage(logs, message.guild);
}
