const Conf = require('conf');
const delay = require('delay');
const NodeTradfriClient = require('node-tradfri-client');
const conf = new Conf();
const dotenv = require('dotenv');
dotenv.config();
const { discoverGateway, TradfriClient } = NodeTradfriClient;

async function getConnection() {
  console.log('Looking for Tradfri gateway...');
  let gateway = await discoverGateway();

  if (gateway == null) {
    console.log('No Tradfri gateway found in local network');
    process.exit(1);
  }

  const tradfri = new TradfriClient(gateway.host);

  if (!conf.has('security.identity') || !conf.has('security.psk')) {
    let securityCode = process.env.IKEASECURITY;
    if (securityCode === '' || securityCode === undefined) {
      console.log(
        'Please set the IKEASECURITY env variable to the code on the back of the gateway'
      );
      process.exit(1);
    }

    console.log('Getting identity from security code');
    try {
      const { identity, psk } = await tradfri.authenticate(securityCode);
      conf.set('security', { identity, psk });
    } catch (e) {
      if (e instanceof TradfriError) {
        switch (e.code) {
          case TradfriErrorCodes.ConnectionTimedOut: {
            console.error(
              'The gateway is unreachable or did not respond in time'
            );
          }
          case TradfriErrorCodes.AuthenticationFailed: {
            console.error(
              'The security code is wrong or something else went wrong with the authentication.'
            );
            // Check the error message for details. It might be that this library has to be updated
            // to be compatible with a new firmware.
          }
          case TradfriErrorCodes.ConnectionFailed: {
            console.error('An unknown error happened while trying to connect');
          }
        }
      }
    }
  }

  console.log('%s\x1b[36m%s\x1b[0m', 'Connecting to gateway: ', gateway.name);

  await tradfri.connect(
    conf.get('security.identity'),
    conf.get('security.psk')
  );

  return tradfri;
}

module.exports = { getConnection: getConnection };

// Only run this method if invoked with "node connection.js"
if (__filename === process.argv[1]) {
  (async () => {
    const tradfri = await getConnection();
    console.log('Connection complete');

    console.log('Waiting 1 second');
    await delay(1000);

    console.log('Closing connection');
    tradfri.destroy();
    process.exit(0);
  })();
}
