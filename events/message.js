const kick = require('../commands/kick');

module.exports = (client, message) => {
  if (message.content.startsWith('.kick')) {
    return kick(message);
  }
  if (message.content.startsWith('.e')) {
    message.reply(`This is not MW!`);
  }
};
