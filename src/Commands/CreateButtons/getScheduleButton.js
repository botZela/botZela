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
                .setDescription("To get your Custom Schedule just type whatever you want in this channel, you will get it in Direct Messages.\nOr just press the button below ,`📅 Get Schedule`, for more convenience.\n")
                .addField(
                    "Any Suggestions",
                    `Consider sending us your feedback in <#922875567357984768>, Thanks.`
                )

        row.addComponents(
            new MessageButton()
                .setCustomId("sendSchedule")
                .setLabel("Waa Tarii9 Siift l'emploi")
                .setStyle("SUCCESS")
                .setEmoji("📅")
        )

        // TODO : Hide the /button_schedule
        await interaction.deferReply();
        interaction.fetchReply().then(inter => inter.delete());
        await interaction.channel.send({embeds:[embed], components: [row]});

    }
    
}