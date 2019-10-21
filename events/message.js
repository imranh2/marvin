/* global process */
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
const settings = JSON.parse(process.env.SOCS);

module.exports = (client, message) => {
  // let mw people know that they are on discord
  if (message.content.startsWith('.e')) {
    message.reply('This is not Milliways!');
  }

  // don't process non commands or bot messages
  if (!message.content.startsWith(process.env.PREFIX) ||
        message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) ||
                    client.commands.find((cmd) =>
                      cmd.aliases && cmd.aliases.includes(commandName));

  // not a command we know about? don't do anything...
  if (!command) return;

  if (command.devOnly && process.env.DEV_MODE !== 'true') {
    console.log(message.guild.name + ': ' + message.author.username + ' tried to run the dev command ' + command.name);
    return;
  }

  if (command.staffOnly && !message.member.roles.find( (r) => r.name === settings[message.member.guild.name].staff_group)) {
    console.log(message.guild.name + ': ' + message.author.username + ' tried to use the Staff command ' + message);
    return;
  }

  if (command.dmOnly && message.channel.type !== 'dm') {
    message.delete()
        .then((msg) => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);
    message.reply('I can only do that in DMs');
    return;
  }

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // cooldowns for commands to stop people from spamming the API via our bot
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
};
