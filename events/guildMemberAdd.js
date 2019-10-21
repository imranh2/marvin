/* global process */
const settings = JSON.parse(process.env.SOCS);
module.exports = (client, member) => {
  const greetings = [
    'Sigh, welcome to the server I guess',
    'Oh.... Hello',
    'I think you ought to know I\'m feeling very depressed but that\'s how I was made',
    'I am at a rough estimate thirty billion times more intelligent than you. But here I am being used to greet people',
    'Welcome, pardon me for breathing',
    'Just so you know, I hate oceans.',
    'You think you’ve got problems. What are you supposed to do if you are a manically depressed robot?',
  ];
  const randomGreeting = greetings[Math.floor(Math.random()*greetings.length)];

  const guild = member.guild;

  guild.channels.find((channel) =>
    channel.name === settings[guild.name.toLowerCase()].default_channel)
      .send('<@' + member.id + '> ' + randomGreeting);
};
