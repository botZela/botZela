const { MessageActionRow, MessageButton, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "button_schedule",
    description: "Create the Schedule button",
    permissions: ["ADMINISTRATOR"],
    /**
     * 
     * @param {Interaction} interaction 
     */
    async execute({ interaction }){
        const row = new MessageActionRow();
        const embed = 
            new MessageEmbed()
                .setColor("RED")
                .setTitle("Get your Schedule Customised for You")
                .setDescription("To get your Custom Schedule just type whatever you want in this channel, you will get it in Direct Messages.\nOr just press the button below ,`📅 Waa Tarii9 Siift l'emploi`, for more convenience.\n")
                .addField(
                    "`️🗑️ Delete old \"DMed\" Schedules`",
                    `By pressing this button, all the old msgs that the bot sent you will be deleted, except the last schedule which it will not be deleted. **Use with Caution**`
                )
                .addField(
                    "Any Suggestions",
                    `Consider sending us your feedback in <#922875567357984768>, Thanks.`
                );

        row.addComponents(
            new MessageButton()
                .setCustomId("sendSchedule")
                .setLabel("Waa Tarii9 Siift l'emploi")
                .setStyle("SUCCESS")
                .setEmoji("📅")
        )

        // row.addComponents(
        //     new MessageButton()
        //         .setCustomId("sendOtherFlGrp")
        //         .setLabel("Other choices")
        //         .setStyle("SECONDARY")
        //         .setEmoji("📅")
        // )

        row.addComponents(
            new MessageButton()
                .setCustomId("schedule_delete_old")
                .setLabel("Delete Old \"DMed\" Schedules ")
                .setStyle("DANGER")
                .setEmoji("🗑️")
        )

        // TODO : Hide the /button_schedule
        await interaction.deferReply();
        interaction.fetchReply().then(inter => inter.delete());
        await interaction.channel.send({embeds:[embed], components: [row]});

    }
    
}