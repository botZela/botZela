module.exports = {
	name: 'messageCreate',
	async execute(client,msg) {   
        if (msg.content === "ping") {    
          msg.reply("pong");    
        }
    }  
}