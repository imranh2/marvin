/* global process */
const settings = JSON.parse(process.env.SOCS);
module.exports = (client, member) => {
  const greeting = `Hey ${member}, welcome to the server`;

  const guild = member.guild;

  guild.channels.find((channel) =>
    channel.name === settings[guild.name.toLowerCase()].default_channel)
      .send(greeting);
};
