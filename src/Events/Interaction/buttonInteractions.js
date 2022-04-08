const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute(client, interaction){
        if(!interaction.isButton()) return;
        const {customId, guild, member} = interaction
        const Button = client.buttons.get(customId);

        if (!Button){
            return interaction.reply({content: "this Button is not handle for now.", ephemeral: true});
        }


        if (Button.cooldown && client.buttonsCooldown.get(customId).get(guild.id)?.includes(member.id)){
            return interaction.reply({content: "You are on cooldown. Try again later.", ephemeral: true});
        }

        if(Button.permissions && !Button.permissions.some((perm) => interaction.member.permissions.has(perm))) {
            return interaction.reply({content: "You are missing permissions.", ephemeral: true});
        }

        if(Button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) {
            return interaction.reply({content: "You are not the owner.", ephemeral: true});
        }

        if (Button.cooldown){
            if (!client.buttonsCooldown.get(customId).get(guild.id)) {
                client.buttonsCooldown.get(customId).set(guild.id,[]);
            }
            client.buttonsCooldown.get(customId).get(guild.id).push(member.id);
            setTimeout(() => {
                const index = client.buttonsCooldown.get(customId).get(guild.id).indexOf(member.id);
                if (index > -1){
                    client.buttonsCooldown.get(customId).get(guild.id).splice(index,1);
                }
            },Button.cooldown);
        }

        Button.execute({ client,interaction });

        // time limit
    }
}