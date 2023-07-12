import { ApplicationCommandOptionType } from 'discord.js';
import ensiasData from '../../../../Models/ensiasData.js';
import { checkDriveId, getIdResourceKey } from '../../../../OtherModules/GDrive/index.js';
import type { DriveFileInterface, ICommand } from '../../../../Typings';
import { client } from '../../../../index.js';
import { createErrorEmbed, createInfoEmbed } from '../../../../utils/index.js';

const defaultExport: ICommand = {
	name: 'ensiasdata',
	description: 'Get your schedule based on your group and field.',
	defaultMemberPermissions: ['Administrator'],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'add',
			type: ApplicationCommandOptionType.Subcommand,
			description: 'Add or update a drive folder to the main panel',
			options: [
				{
					name: 'drive',
					type: ApplicationCommandOptionType.String,
					description: 'The url of the drive that you want to create.',
					required: true,
				},
				{
					name: 'name',
					type: ApplicationCommandOptionType.String,
					description: 'Name of the drive folder',
					required: true,
				},
			],
		},
		{
			name: 'remove',
			type: ApplicationCommandOptionType.Subcommand,
			description: 'remove a data that is not used',
			options: [
				{
					name: 'name',
					type: ApplicationCommandOptionType.String,
					description: 'Name of the drive folder',
					required: true,
				},
			],
		},
	],
	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		const { channel, options, guild } = interaction;
		if (!guild || !channel) {
			const embed = createErrorEmbed('Get Files', 'This command is used inside a server ...');
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}

		const subCommand = options.getSubcommand();

		if (subCommand === 'add') {
			const driveUrl = options.getString('drive', true);

			const results = getIdResourceKey(driveUrl);
			if (results === null) {
				const embed = createErrorEmbed(
					'Get Files',
					'Please enter a valide drive url (https://drive.google.com/drive/folders/**driveId**)',
				);
				return interaction.followUp({
					embeds: [embed],
					ephemeral: true,
				});
			}

			const folder: DriveFileInterface = {
				name: '',
				id: results.id,
				resourceKey: results.resourceKey,
			};

			if (!(await checkDriveId(folder))) {
				const embed = createErrorEmbed('Get Files', 'The drive url that you provided is not valid');
				return interaction.followUp({
					embeds: [embed],
					ephemeral: true,
				});
			}

			folder.name = options.getString('name', true);
			const driveData = await ensiasData.findOne({ driveName: folder.name });

			if (driveData) {
				driveData.driveId = folder.id;
				driveData.driveResourceKey = folder.resourceKey;
				driveData.driveName = folder.name;
				await driveData.save();
				const embed = createInfoEmbed('Ensias Data', `The Data for ${folder.name} was updated successfully.`);
				return interaction.followUp({
					embeds: [embed],
					ephemeral: true,
				});
			}

			await ensiasData.create({
				driveName: folder.name,
				driveId: folder.id,
				driveResourceKey: folder.resourceKey,
			});
			const embed = createInfoEmbed('Ensias Data', `The Data for ${folder.name} was created successfully.`);
			return interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}

		if (subCommand === 'remove') {
			const name = options.getString('name', true);
			const driveData = await ensiasData.findOne({ driveName: name });

			if (driveData) {
				await driveData.deleteOne();
				const embed = createInfoEmbed('Ensias Data', `The Data for ${name} was deleted successfully.`);
				return interaction.followUp({
					embeds: [embed],
					ephemeral: true,
				});
			}

			return interaction.followUp({ content: 'Data was not found.', ephemeral: true });
		}
	},
};

export default defaultExport;
