const { logsChannel } = require("./logsMessage");

async function createRole(client,guild,name){
    try{
        let role = await guild.roles.create({
            name : name,
        });
        let message =  `[INFO] Role .${role.name} Created Succesfully`;
        console.log(message);
        logsMessage(client,message,guild);
    } catch (e){
        message = `[INFO] Failed to create Role ${name} in server ${guild.name}`;
        console.log(message);
        logsMessage(client,message,guild);
    }
}

module.exports = {
    createRole,
}
