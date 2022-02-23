const { saveData } = require("../utils/saveData");
const data = require("../data/data.json");

module.exports = {
	name: 'roleUpdate',
	async execute(client,oldRole,newRole) {
        if (oldRole.name === newRole.name) return;
        console.log(`${oldRole.name} role has been updated to ${newRole.name}`);
        try{
            delete data["ROLES"][`${role.guild.id}`][`${role.name}`];
        }finally{
            console.log(`${oldRole.name} role was not in data`);
        }
        data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
		saveData();
    },  
}