import fs from 'node:fs/promises';
import { ApplicationCommandOptionType } from 'discord.js';
import type { ICommand } from '../../../../Typings';
import { client } from '../../../../index.js';
import { flGrpYr } from '../../../../utils/Schedule/flGrp.js';
import { createEmbed, logsEmbed } from '../../../../utils/index.js';

function firstLastName(nickname: string) {
	const arrayName = nickname.split(/ +/g);
	if (arrayName.length === 2) {
		return {
			lastName: arrayName.at(0)!.toUpperCase(),
			firstName: arrayName.at(1)!.toUpperCase(),
		};
	}

	const lastNameArray: string[] = [];
	const firstNameArray: string[] = [];
	for (const name of arrayName) {
		if (name === name.toUpperCase()) {
			lastNameArray.push(name);
		} else {
			firstNameArray.push(name);
		}
	}

	return {
		lastName: lastNameArray.join(' ').toUpperCase(),
		firstName: firstNameArray.join(' ').toUpperCase(),
	};
}

const defaultExport: ICommand = {
	name: 'getassurance',
	description: 'Get your schedule based on your group and field.',
	cooldown: 10 * 1_000,
	// Permissions: [],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'dm',
			type: ApplicationCommandOptionType.Boolean,
			description: 'Do you want to receive your schedule in Direct Messages?',
			required: false,
		},
	],
	async execute({ interaction }) {
		const { options, member, guild } = interaction;
		await interaction.deferReply({ ephemeral: true });
		if (!guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		if (guild.id !== client.testGuilds.find((server) => server.name.includes('ENSIAS'))?.id) {
			return interaction.followUp({
				content: 'This command is not available for this server.',
				ephemeral: true,
			});
		}

		const { filiere, year } = flGrpYr(member);
		if (year?.name !== '2A' && year?.name !== '3A') {
			return interaction.followUp({
				content: 'This command is only available for 2A and 3A Students. Sorry!',
				ephemeral: true,
			});
		}

		if (!filiere || !member.nickname) {
			return interaction.followUp({
				content: 'CHAFAAAAAAR',
				ephemeral: false,
			});
		}

		const { lastName, firstName } = firstLastName(member.nickname);

		const text = `__**${year.name} Insurance.**__ `;
		let fileNamePdf = `${lastName} ${firstName}.pdf`;
		let pdfPath = `./data/Schedules/Assurances_${year.name}/${filiere.name ?? 'filiere'}/${fileNamePdf}`;

		try {
			await fs.access(pdfPath);
		} catch {
			fileNamePdf = `${firstName} ${lastName}.pdf`;
			pdfPath = `./data/Schedules/Assurances_${year.name}/${filiere.name ?? 'filiere'}/${fileNamePdf}`;
			try {
				await fs.access(pdfPath);
			} catch {
				return interaction.followUp({
					content:
						"Can't find Your Insurance. Please Check your nickname, and tell the problem to one of the <@&921522743604813874>",
					ephemeral: false,
				});
			}
		}

		const embed = createEmbed(`Assurance ${year.name}`, '__**Your "Assurance" is ready**__ ');
		await interaction.followUp({
			content: text,
			embeds: [embed],
			files: [pdfPath],
			ephemeral: true,
		});

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		const dm = options ? (options.getBoolean('dm') === null ? true : options.getBoolean('dm')) : true;
		if (dm) {
			await member.send({
				embeds: [embed],
			});
			await member.send({
				files: [pdfPath],
			});
		}

		const logs = `%user% got their Insurance.`;
		await logsEmbed(logs, guild, 'info', member);
	},
};

export default defaultExport;
