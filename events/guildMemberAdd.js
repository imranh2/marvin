/* global process */
const settings = JSON.parse(process.env.SOCS);
module.exports = (client, member) => {

  if (process.env.DEBUG === 'true') {
    console.log("DEBUG: Incoming event: ", "guildMemberAdd");
  }

  const greeting = `Hey ${member}, welcome to the server`;

  const guild = member.guild;

  guild.channels.cache.find((channel) =>
    channel.name === settings[guild.name.toLowerCase()].default_channel)
      .send(greeting);
};
