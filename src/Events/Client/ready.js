const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { DatabaseUri } = require(`${process.cwd()}/credentials/config.json`);

module.exports = {
    name: "ready",
    // once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        const { user } = client;
        user.setPresence({
            activities: [
                {
                    name: "with WHAT'S N3XT team",
                    type: "WATCHING",
                },
            ],
            status: "online",
        });
        console.log(`[INFO] Ready! Logged in as ${user.tag}`);

        // The connection to the Database(MongoDB)
        if (!DatabaseUri) return console.log("[INFO] -----------------");
        try {
            await mongoose.connect(DatabaseUri, {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("[INFO] The Client is now connected to the DataBase.");
        } catch(err){
            console.log("[ERROR] The Client did not connect to the DataBase Please Check the DatabaseUri.");
        }
        console.log("[INFO] -----------------");
    },
};
