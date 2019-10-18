module.exports = {
  name: 'kick',
  description: 'Kick someone',
  args: true,
  usage: '<user>',
  cooldown: 10,
  guildOnly: true,
  execute(message) {
    const member = message.mentions.members.first();

    if (!member) {
      return message.reply(
          `Who are you trying to kick? You must mention a user.`
      );
    }

    if (!member.kickable) {
      return message.reply(`I can't kick this user. Sorry!`);
    }

    member
        .kick()
        .then(() => message.reply(`${member.user.tag} was kicked.`))
        .catch((error) => message.reply(`Sorry, an error occured.`));
  },
};
