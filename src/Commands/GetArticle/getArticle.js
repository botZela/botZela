const { getArticle } = require("../../utils/GetArticle/downloadArticle.js");
const { createEmbed } = require("../../utils/createEmbed");
const { client } = require("../../index");

module.exports = {
    name: "getarticle",
    description: "Download article by DOI",
    options: [
        {
            name: "doi",
            description: "The DOI of the Article",
            type: "STRING",
            required: true,
        },
    ],
    guilds : [
        client.testGuilds.find(guild => guild.name.includes("ENSIAS"))?.id || "" ,
    ],
    async execute({ client, interaction }) {
        await interaction.deferReply({ ephemeral: true });
        const doi = interaction.options.getString("doi");
        const article = await getArticle(doi);
        const { member } = interaction;
        const embed = createEmbed('Article Finder', "The article is sent to your DMs ");
        const embed2 = createEmbed(`Article Finder`, "Your article is ready ");
        const embed3 = createEmbed(`Article Finder`, "Article or DOI is unavailable.");
        const embed4 = createEmbed(`Article Finder`, "Size of the article is bigger than 8MB.");
        if (article === 0) {
            await interaction.followUp({
                ephemeral: true,
                embeds: [embed3],
            });
        } else if (article === 1){
            await interaction.followUp({
                ephemeral: true,
                embeds: [embed4],
            });
        } else {
            await member.send({
                embeds: [embed2],
            });
            await member.send({
                files: [
                    `./data/downloads/Articles/${article}`,
                ],
            });
            await interaction.followUp({
                ephemeral: true,
                embeds: [embed],
            });
        }
    },
};
