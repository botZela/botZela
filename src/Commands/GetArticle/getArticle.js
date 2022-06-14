const { getArticle } = require("../../utils/GetArticle/downloadArticle.js");

module.exports = {
    name: "getarticle",
    description: "download article by DOI",
    options: [
        {
            name: "doi",
            description: "The DOI of the Article",
            type: "STRING",
            required: true,
        },
    ],
    async execute({ client, interaction }) {
        await interaction.deferReply({ ephemeral: true });
        const doi = interaction.options.getString("doi");
        const article = await getArticle(doi);
        const member = interaction.member;
        if (article) {
            await member.send({
                files: [`../../utils/GetArticle/downloads/${article}`],
            });
            await interaction.followUp({
                content: `The article is sent to your DMs`,
                ephemeral: true,
            });
        } else {
            await interaction.followUp({
                content: `Article or DOI is unavailable.`,
                ephemeral: true,
            });
        }
    },
};
