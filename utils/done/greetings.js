const {choice} = require("./choice.js")

function greetings(member) {
    const emojis = [
        `:confetti_ball:`,
        `:tada:`,
        `:partying_face:`,
        `:innocent:`,
        `:sparkles:`,
    ];
    const emoji = choice(emojis);
    const welcomeMsgs = [
        `<@${member.id}> just joined the server ${emoji}- glhf!`,
        `<@${member.id}> just joined ${emoji}. Everyone, look busy!`,
        `<@${member.id}> just joined ${emoji}. Can I get a heal?`,
        `<@${member.id}> joined your party ${emoji}.`,
        `<@${member.id}> joined ${emoji}. You must construct additional pylons.`,
        `Ermagherd. <@${member.id}> is here ${emoji}.`,
        `Welcome, <@${member.id}> ${emoji}. Stay awhile and listen.`,
        `Welcome, <@${member.id}> ${emoji}. We were expecting you ( ͡° ͜ʖ ͡°)`,
        `Welcome, <@${member.id}> ${emoji}. We hope you brought pizza.`,
        `Welcome <@${member.id}> ${emoji}. Leave your weapons by the door.`,
        `A wild <@${member.id}> appeared ${emoji}.`,
        `Swoooosh. <@${member.id}> just landed ${emoji}.`,
        `Brace yourselves. <@${member.id}> just joined the server ${emoji}.`,
        `<@${member.id}> just joined ${emoji}. Hide your bananas.`,
        `<@${member.id}> just arrived ${emoji}. Seems OP - please nerf.`,
        `<@${member.id}> just slid into the server ${emoji}.`,
        `A <@${member.id}> has spawned in the server ${emoji}.`,
        `Big <@${member.id}> showed up ${emoji}!`,
        `<@${member.id}> just showed up ${emoji}. Hold my beer.`,
    ];
    const message = choice(welcomeMsgs);
    return message;
}

module.exports = {
    greetings,
}