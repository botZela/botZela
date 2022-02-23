const { saveData } = require("../utils/done/saveData");
const data = require("../data/data.json");
module.exports = {
	name: 'roleDelete',
	async execute(client,role) {
		try{
			console.log(`${role.name} has been deleted.`);
			delete data["ROLES"][`${role.guild.id}`][`${role.name}`];
			saveData();
		} finally{
			console.log(`Role ${role.name} was not in data`);
		}
	},  
}