module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size-1} users.`);
};
