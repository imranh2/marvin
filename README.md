# A Discord bot named Marvin

A Discord bot for SUCS and maybe other servers.

Relatively simple structure, `index.js` is the init, reads files in `events` 
 dir that coorospond to incoming events from Discord. Bot commands are
 handled by `message.js` which should look in the `commands` dir for the
 coorosponding commands.

`master` branch is latest and greatest, `tags` are for specific 
 vertsions/releases.

## How to dev?

You'll need your own testing server for now.

1. Close the repo
2. Get a bot token for a dev server
3. Create a file called .env and add the line `BOT_TOKEN=<your token here`
4. Run `npm run dev` and changes to files are tracked automagically

## How to contribute?

Fork the repo, create a branch per feature/bug, and submit a Merge Request.

Your code must pass the tests which can be verified by you running
 `npm run test`
