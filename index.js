/* global process*/
require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
client.commands = new Discord.Collection();

if (process.env.DEV_MODE === 'true') {
  console.log('DEV_MODE set, enabling dev commands...');
}

// main event handler, look in a folder clled "events" and when one comes in
// that matches use that file
fs.readdir('./events/', (err, files) => {
  files.forEach((file) => {
    const eventHandler = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, (...args) => eventHandler(client, ...args));
  });
});

const commandFiles = fs.readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ( command.devOnly && process.env.DEV_MODE !== 'true') {
    console.log('Not loading command ' + command.name + ' as it\'s marked as dev but we are not in DEV_MODE');
  } else {
    client.commands.set(command.name, command);
  }
}

client.login(process.env.BOT_TOKEN);
