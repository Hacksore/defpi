const express = require('express')
const app = express();
const path = require('path');
const oui = require('oui');
const { exec } = require('child_process');
let port = 1337;

let arpCommand = 'sudo arp-scan --localnet --interface=wlan0'
if (process.env.NODE_ENV === 'development') {
  console.log('We are in dev mode 😎')
  port = 8080;

  // the old macbook haz different interface
  arpCommand = 'sudo arp-scan --localnet --interface=en0'
}

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});


// this was acting like a captive portal, need to invistegate more.
// app.use( (req, res, next) => {
//   const ip = req.connection.remoteAddress;
//   if (ip !== '127.0.0.1') {
//     console.log('Kindly fuck off', ip);
//     return res.json({ message: 'Kindly fuck off please!' })
//   }
//   next();
// });

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/clients', async (req, res) => {
  const clients = await scanForClients();
  res.json(clients);
});

// TODO: make ssid random?
app.get('/ssid', (req, res) => {
  res.json({});
});

function scanForClients() {

  return new Promise((resolve, reject) => {
    const connectedClients = [];
    
    exec(arpCommand, (err, stdout, stderr) => {

      let lines = stdout.split('\n');    
      lines = lines.splice(2, lines.length-6);
      
      lines.forEach(item => {
        const client = item.split(/(\s+)/).filter(item => item.trim().length > 0);

        if (item[0] !== undefined) {
          const info = {
            ip: client[0],
            mac: client[1]
          }

          try {
            info.vendor = oui(client[1]).split('\n')[0];
          } catch (e) {
            info.vendor = 'Anonymous'
          }

          connectedClients.push(info);
        }
      });

      resolve(connectedClients);

    });
  });
}

// we don't want everyone to access this only the pi
app.listen(port, '127.0.0.1');
