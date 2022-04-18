const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { DatabaseUri } = require(`${process.cwd()}/credentials/config.json`);

module.exports = {
    name: "error",
    // once: true,
    /**
     * @param {Client} client
     */
    async execute(client,error) {
        console.error(error);
        const channel = client.channels.cache.get("935315424592166942");
        await channel.send("```css\n" + error + "\n```");

    },
};
