module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Ready to serve on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);
  console.log('');
  // console.log(client.guilds.cache);

  client.guilds.cache.forEach( async (server) => {
    // console.log(server);
    console.log('Connected to server: ' + server.name);
    console.log(' - Server Owner: ' + (await client.user.fetch(server.owner)).username);
    console.log(' - Users: ' + server.memberCount);
    console.log(' - Users Online: ' + server.presences.cache.size);
    console.log(' - Users that are Bots: ' + server.members.cache.filter((member) => member.user.bot).size);
    console.log(' - Role: ' + server.me.roles.highest.name);
  });
};
