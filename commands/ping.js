module.exports = {
  name: 'ping',
  description: 'Ping!',
  cooldown: 5,
  devOnly: false,
  staffOnly: false,
  execute(client, message) {
    message.reply('Pong.');
  },
};
