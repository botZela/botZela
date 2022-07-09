import { MessageActionRow, MessageButton } from 'discord.js';
import { client } from '../../..';
import ensiasDrive from '../../../Models/guildDrive-Ensias';
import { checkDriveId, getDriveName } from '../../../OtherModules/GDrive';
import { ICommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
const yearArray = ['1A', '2A', '3A'];

const defaultExport: ICommand = {
	name: 'ensiasfiles',
	description: 'Get your schedule based on your group and field.',
	permissions: ['ADMINISTRATOR'],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'add',
			type: 'SUB_COMMAND',
			description: 'Add a drive folder to the main panel',
			options: [
				{
					name: 'drive',
					type: 'STRING',
					description: 'The id of the drive that you want to create.',
					required: true,
				},
				{
					name: 'year',
					type: 'STRING',
					description: 'Choose the Year',
					choices: yearArray.map((x) => ({ name: x, value: x })),
					required: true,
				},
				{
					name: 'filiere',
					type: 'STRING',
					description: 'Choose the branch',
					choices: filieresArray.map((x) => ({ name: x, value: x })),
					required: true,
				},
				{
					name: 'name',
					type: 'STRING',
					description: 'Name of the drive folder',
					required: false,
				},
			],
		},
		{
			name: 'panel',
			type: 'SUB_COMMAND',
			description: 'Send the Embed.',
			options: [
				{
					name: 'message',
					description: 'The message id you want to edit,(it must be sent by the bot).',
					type: 'STRING',
					required: false,
				},
			],
		},
	],
	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		const { channel, options, guild } = interaction;
		if (!guild || !channel) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}
		const subCommand = options.getSubcommand();

		if (subCommand === 'add') {
			const filiere = options.getString('filiere')!;
			const year = options.getString('year')!;
			const driveId = options.getString('drive');

			if (!driveId) {
				return interaction.followUp({
					content: 'Please enter a drive Id (https://drive.google.com/drive/u/0/folders/**driveId**)',
					ephemeral: true,
				});
			}

			if (!(await checkDriveId(driveId))) {
				return interaction.followUp({ content: 'The drive Id that you provided is not valid', ephemeral: true });
			}

			const driveName = options.getString('name') ?? (await getDriveName(driveId));
			const driveData = await ensiasDrive.findOne({ filiere, year });

			if (driveData) {
				driveData.driveId = driveId;
				driveData.driveName = driveName;
				await driveData.save();
				return interaction.followUp({ content: 'The panel was updated with the new drive.', ephemeral: true });
			}

			await ensiasDrive.create({
				filiere,
				year,
				driveName,
				driveId,
			});
			return interaction.followUp({
				content: `The drive for the year: __**${year}**__ and branch:__** ${filiere}**__ was created successfully`,
				ephemeral: true,
			});
		}
		if (subCommand === 'panel') {
			const msgId = options.getString('message');
			const panelEmbed = createEmbed(
				`Get Files `,
				`The easiest way to get access directly to the files that you are looking for.\n(Cours, TD, TP, Exams, Lasse9at, ...)`,
			).addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);

			const components = [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('button-ensiasfiles-init')
						.setLabel('Get Files')
						.setStyle('SUCCESS')
						.setEmoji('📚'),
				),
			];

			if (msgId) {
				const sentMessage = await channel.messages.fetch(msgId);
				await sentMessage.edit({ embeds: [panelEmbed], components });
			} else {
				await channel.send({ embeds: [panelEmbed], components });
			}
			return interaction.followUp({ content: 'The panel was created successfully', ephemeral: true });
		}
	},
};

export default defaultExport;
