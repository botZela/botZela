const {saveData} = require("../util/done/saveData.js");
const data = require("../data/data.json");

module.exports = {
	name: 'guildCreate',
	async execute(client,guild) {
		console.log(`Joined server : ${guild.name}`);
		data["ROLES"][`${guild.id}`] = {};
        const roles = guild.roles;
        for (var role in roles){
            data["ROLES"][`${guild.id}`][role.name] = role.id
		};
		saveData()
        //await self.setup_logs_commands_channels(guild)
    },  
}