/* global process */
const settings = JSON.parse(process.env.SOCS);
module.exports = {
  name: 'verify',
  description: 'Verify your society membership status',
  usage: '<society> <student number> <transaction id>',
  args: true,
  cooldown: 10,
  devOnly: false,
  staffOnly: false,
  dmOnly: true,
  async execute(client, message, args) {
    /**
    * Return some test api data, only 2 members, one studnet, one alumni
    * (sn: 786857, transid: 123456)
    * (sn: 785857, transid: 654321)
    * fuction
    * @param {string} apikey - key needed to query the SUCS SU APIv2
    * @param {string} orgid - MSL orgid of the soc
    * @return {json} - API like Test data
    */
    function getTestAPIData(apikey, orgid) {
      return JSON.parse('{"@attributes":{"Name":"Product Purchasers Report (System)"},"table2":{"Detail_Collection":{"Detail":{"@attributes":{"textbox37":"ALL","textbox23":"ALL","textbox53":"Computer (SUCS)","textbox28":"2019-09-01T00:00:00","textbox51":"2020-08-31T00:00:00","textbox48":"* ALL *","textbox45":"* ALL *"}}}},"table1":{"table1_Product_Collection":{"table1_Product":[{"@attributes":{"product_name":"[10000820] Computer (SUCS) Standard Membership"},"Detail_Collection":{"Detail":[{"@attributes":{"transaction_id":"123456","purchaser":"HUSSAIN, IMRAN","textbox6":"","card_number":"786857","shop_name":"Website","qty":"1","purchase_date":"2019-10-05T17:25:15.333"}}]}},{"@attributes":{"product_name":"[10000830] Computer (SUCS) Associate Membership"},"Detail_Collection":{"Detail":[{}]}}]}}}').table1.table1_Product_Collection.table1_Product[0].Detail_Collection.Detail;
    }

    /**
    * Queries the real SUCS SU APIv2 and returns some JSON
    * fuction
    * @param {string} apikey - key needed to query the SUCS SU APIv2
    * @param {string} orgid - MSL orgid of the soc
    * @return {json} - SUCS SU APIv2 data
    */
    async function getAPIData(apikey, orgid) {
      console.log('Calling the SUCS SU-APIv2');
      const apiurl = 'http://su-apiv2.sucs.org/?apikey='+apikey+'&orgid='+orgid;

      const getContent = function(url) {
        // return new pending promise
        return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
          const lib = url.startsWith('https') ? require('https') : require('http');
          const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
          });
          // handle connection errors of the request
          request.on('error', (err) => reject(err));
        });
      };

      const apiResponse = await getContent(apiurl);

      // Check to see if we only get one type of member
      if (JSON.parse(apiResponse).table1.table1_Product_Collection.table1_Product[0] === undefined) {
        return JSON.parse(apiResponse).table1.table1_Product_Collection.table1_Product.Detail_Collection.Detail;
      } else {
        return JSON.parse(apiResponse).table1.table1_Product_Collection.table1_Product[0].Detail_Collection.Detail;
      }
    }

    /**
    * Verifies the person is a member and adds them to thr discord role
    * fuction
    * @param {json} apiData - SUCS SU APIv2 formated JSON
    * @return {null} - nothing :)
    */
    async function verifyMembership(apiData) {
      message.reply('Trying to verify your membership');
      message.reply('This could take awhile');
      message.reply('I\'m not very fast...');
      let verified = false;

      await apiData.forEach(function(member) {
        if (verified) {
          return;
        }

        member = member['@attributes'];

        if (member.transaction_id === transid && member.card_number === sn) {
          console.log('Sucess! ' + message.author.username + ' is in ' + soc);

          const targetGuild = client.guilds.cache.find((val) => val.name.toLowerCase() === soc);
          const targetRole = targetGuild.roles.cache.find((val) => val.name === settings[soc].member_group );
          targetGuild.members.fetch(message.author)
              .then( (discordMember) => {
                discordMember.roles.add(targetRole);
                console.log('Added ' + message.author.username + ' to the members role');
                message.reply('Ah, hello ' + member.purchaser.split(' ').slice(-1));
                message.reply('You\'ve been verified! :)');
                verified = true;
                return;
              }
              )
              .catch( (error) => {
                console.log('Unable to add ' + message.author.username + ' to the members role');
                console.error(error);
                message.reply('Sorry there was a error');
                return;
              }
              );
        }
      });
      // No match found, probably not a member
      if (!verified) {
        console.warn('Couldn\'t verify ' + message.author.username + ' ');
        message.reply('Bah!');
        message.reply('Couldn\'t find you in the list of members');
        // message.reply(':(');
        return;
      }
    }

    const soc = args[0].toLowerCase();
    const sn = args[1];
    const transid = args[2];

    console.log('Verify ' + message.author.username + ' is in ' + soc);

    if (settings[soc] === undefined) {
      console.error('Unsupported society!');
      message.reply('That society doesn\'t like me :(');
      return;
    }
    if (isNaN(sn)) {
      console.error('Invalid Student Number!');
      message.reply('I don\'t think that\'s a real student number');
      return;
    }
    if (isNaN(transid)) {
      console.error('Invalid Transaction ID');
      message.reply('You can find your transaction ID at http://www.swansea-union.co.uk/shop/purchasehistory/');
      return;
    }

    let apiData;

    if (process.env.DEV_MODE === 'true') {
      apiData = getTestAPIData(settings[soc].apikey, settings[soc].orgid);
    } else {
      apiData = await getAPIData(settings[soc].apikey, settings[soc].orgid);
    }

    verifyMembership(apiData);
  },
};
