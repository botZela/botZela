const {saveData} = require("../utils/saveData.js");
const data = require("../data/data.json");
module.exports = {
	name: 'roleCreate',
	async execute(client,role) {
		console.log(`${role.name} has been created.`);
		data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
		saveData();
    },  
}