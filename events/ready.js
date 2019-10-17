module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
  console.log('');
  // console.log(client.guilds);

  client.guilds.forEach( async (server) => {
    // console.log(server);
    console.log('Connected to server: ' + server.name);
    console.log(' - Server Owner: ' + (await client.fetchUser(server.owner)).username);
    console.log(' - Users: ' + server.memberCount);
    console.log(' - Users Online: ' + server.presences.size);
    console.log(' - Users that are Bots: ' + server.members.filter((member) => member.user.bot).size);
    console.log(' - Role: ' + server.me.highestRole.name);
  });
};
