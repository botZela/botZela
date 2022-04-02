const { ContextMenuInteraction, MessageEmbed} = require("discord.js");

module.exports = {
    name : "userinfo",
    type : "USER",
    context : true,
    permissions : ["ADMINISTRATOR"],
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction){
        const target = await interaction.guild.members.fetch(interaction.targetId);
        
        const response = new MessageEmbed()
            .setColor("AQUA")
            .setAuthor({ name: target.user.tag, iconURL: target.user.avatarURL({ dynamic: true, size: 512 }) })
            .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
            .addField("ID", `${target.user.id}`)
            .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone","") || "None"}`)
            .addField("Member Since", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
            .addField("Discord User Since",`<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,true)

        interaction.reply({embeds : [response], ephemeral:true})

    }
}