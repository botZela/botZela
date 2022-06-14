const { setupServer } = require("../../utils/SetupServer/setupServer");
const { checkSpreadsheet } = require("../../utils/SetupServer/checkLinks");
const gChannels = require("../../Models/guildChannels");
const linksModel = require("../../Models/guildLinks");

module.exports = {
    name: "setup",
    description: "Setup the server",
    options: [
        {
            type: 'SUB_COMMAND_GROUP',
            name: 'channels',
            description: 'Setup channels.',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'logs',
                    description: 'Setup the logs Channel',
                    options: [
                        {
                            name : 'channel',
                            description: 'logs Channel',
                            type: 'CHANNEL',
                            required: true,
                        },
                    ],
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'commands',
                    description: 'Setup the commands Channel',
                    options: [
                        {
                            name : 'channel',
                            description: 'commands Channel',
                            type: 'CHANNEL',
                            required: true,
                        },
                    ],
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'introduce',
                    description: 'Setup the introduce Channel',
                    options: [
                        {
                            name : 'channel',
                            description: 'introduce Channel',
                            type: 'CHANNEL',
                            required: true,
                        },
                    ],
                },
            ],

        },
        {
            type: 'SUB_COMMAND_GROUP',
            name: 'link',
            description: 'Setup server Links.',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'spreadsheet',
                    description: 'Setup the Spreadsheet for the server',
                    options: [
                        {
                            name : 'url',
                            description: 'The url of the Spreadsheet',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'form',
                    description: 'Setup the Spreadsheet for the server',
                    options: [
                        {
                            name : 'url',
                            description: 'The url of the From',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'server',
            description: 'Setup Guide.',
        },
    ],
    permissions: ["ADMINISTRATOR","MANAGE_ROLES"],
    async execute({ interaction } ) {
        await interaction.deferReply({ content: '...', ephemeral: true, })
        const {guild} = interaction;
        const subCommand = interaction.options.getSubcommand();
        if (subCommand === 'server'){
            return await interaction.followUp({ content: 'Setting up the server .... ', ephemeral: true });
        }
        const subCommandGroup = interaction.options.getSubcommandGroup();
        if (subCommandGroup === "channels"){
            const channel = interaction.options.getChannel('channel');
            const guildData = await gChannels.findOne({guildId: guild.id});
            let channelType = subCommand.toUpperCase();
            
            if (guildData){
                guildData.channels.set(channelType, channel.id);
                await guildData.save();
            } else {
                const channelsObj = JSON.parse(`{
                    "${channelType}": "${channel.id}"
                }`)
                await gChannels.create({
                    guildId: guild.id,
                    guildName: guild.name,
                    channels: channelsObj,
                });
            }
            channel.send("This channel is Up and running")
            return await interaction.followUp({ 
                content: `[INFO] ${channelType} Added Successfully`, 
                ephemeral: true,
            });

        } else if (subCommandGroup === "link") {
            const link = interaction.options.getString('url');
            if (subCommand === "spreadsheet"){
                await checkSpreadsheet(interaction.client, interaction, link);
            } else if (subCommand === "form"){
                const guildData = await linksModel.findOne({guildId:guild.id});
                if (guildData){
                    guildData.form = link;
                    await guildData.save();
                } else {
                    await linksModel.create({
                        guildId: guild.id,
                        guildName: guild.name,
                        form: link,
                    });
                }
                return await interaction.followUp({ content: `This server's Form Link Added Successfully.`, ephemeral: true });
            }

        }
        
        await interaction.followUp({ content: "Setting up the server .... ", ephemeral: true, })
        return;

    }
}