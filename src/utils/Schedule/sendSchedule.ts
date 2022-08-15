import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from 'discord.js';
import { FiliereNameType, GroupeNameType } from '../../Typings/Ensias';
import { createEmbed } from '../Embeds';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendSchedule(member: GuildMember, filiere: FiliereNameType, groupe: GroupeNameType) {
	const row = new ActionRowBuilder();
	row.addComponents(
		new ButtonBuilder().setCustomId('DeleteMsgSchedule').setLabel('Delete Me').setStyle(ButtonStyle.Danger),
	);
	// const fileNamePng = `Emploi_${filiere}_${groupe}.png`;
	// let fileNamePdf = `Emploi_${filiere}_${groupe}.pdf`;
	// let embed = createEmbed(`Schedule ${filiere} ${groupe}`, "__**Your Schedule of this week :**__ ");
	// const text = `__**The Planning of S2 Finals.**__ `;
	const fileNamePng1 = `Planning_Rattrapages_S2-1.png`;
	const fileNamePng2 = `Planning_Rattrapages_S2-2.png`;
	const fileNamePdf = `Planning_Rattrapages_S2.pdf`;
	const embed = createEmbed(`Finals Schedule`, '__**Finals Schedule (Rattrapages)**__ ');
	await member.send({
		embeds: [embed],
	});
	await member.send({
		files: [
			`./data/Schedules/emploi_1A/${fileNamePdf}`,
			`./data/Schedules/emploi_1A/${fileNamePng1}`,
			`./data/Schedules/emploi_1A/${fileNamePng2}`,
		],
		// Components: [row]
	});
}
